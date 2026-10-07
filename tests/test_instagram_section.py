from pathlib import Path
import unittest
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
URLS = [
    'https://www.instagram.com/reel/DeMz4i4IoyT/?stkn=OWY2dDlyOWhkdzNu',
    'https://www.instagram.com/reel/DeM5_9UoXXe/?stkn=cmNnc3p2cGsyNG8z',
]

class InstagramSectionTest(unittest.TestCase):
    def test_follow_button_contains_instagram_logo(self):
        html = (ROOT / 'index.html').read_text()
        start = html.index('<a class="instagram-follow"')
        button = html[start:html.index('</a>', start)]
        self.assertIn('class="instagram-logo"', button)
        self.assertIn('aria-hidden="true"', button)
        self.assertIn('<rect', button)
        self.assertIn('<circle', button)

    def test_visitors_can_open_both_supplied_reels_after_company(self):
        html = (ROOT / 'index.html').read_text()
        self.assertIn('id="instagram"', html, 'Instagram section is missing')
        start = html.index('<section class="content-section instagram-section"')
        end = html.index('</section>', start)
        section = html[start:end]
        self.assertLess(html.index('id="company"'), start)
        self.assertLess(start, html.index('id="meeting"'))
        class Tags(HTMLParser):
            def __init__(self):
                super().__init__()
                self.links, self.images, self.media = [], [], []
            def handle_starttag(self, tag, attrs):
                data = dict(attrs)
                if tag == 'a': self.links.append(data)
                if tag == 'img': self.images.append(data)
                if tag in ('video', 'iframe'): self.media.append(tag)
        parser = Tags()
        parser.feed(section)
        for url in URLS:
            links = [a for a in parser.links if a.get('href') == url]
            self.assertEqual(len(links), 1)
            self.assertEqual(links[0].get('target'), '_blank')
            self.assertIn('noopener', links[0].get('rel', ''))
        self.assertTrue(any(a.get('href') == 'https://www.instagram.com/solerongroup/' for a in parser.links))
        self.assertEqual(len(parser.images), 2)
        self.assertEqual(parser.media, [], 'Do not load videos or Instagram embeds')
        for image in parser.images:
            self.assertEqual(image.get('loading'), 'lazy')
            self.assertEqual(image.get('decoding'), 'async')
            self.assertTrue(image.get('alt'))
            self.assertTrue(image.get('width') and image.get('height'))
            self.assertTrue((ROOT / image['src']).is_file())
            self.assertLess((ROOT / image['src']).stat().st_size, 160_000)
        self.assertIn('not actual trading results', section)
        self.assertIn('Trading involves risk', section)

if __name__ == '__main__':
    unittest.main()
