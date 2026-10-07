"""Verify the actual rendered play controls and Instagram follow logo."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

OUT = Path('/Users/apoabi/.hermes/artifacts/soleron-instagram')
OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    for width in (1440, 390, 320):
        page = browser.new_page(viewport={'width': width, 'height': 1000}, reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto('http://127.0.0.1:8877/#instagram', wait_until='networkidle')
        page.locator('#instagram').scroll_into_view_if_needed()
        controls = page.locator('.reel-play').evaluate_all('''es=>es.map(e=>{
            const b=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect(),s=getComputedStyle(e);
            return {width:b.width,height:b.height,dx:b.x+b.width/2-p.x-p.width/2,dy:b.y+b.height/2-p.y-p.height/2,shadow:s.boxShadow,background:s.backgroundImage,color:s.color,fill:s.backgroundColor};
        })''')
        assert len(controls) == 2
        for control in controls:
            assert abs(control['dx']) < 1 and abs(control['dy']) < 1, f'Not centered at {width}: {control}'
            assert control['width'] >= 84 and control['height'] >= 84, control
            assert control['shadow'] == 'none' and control['background'] == 'none', control
            assert control['color'] == 'rgb(255, 255, 255)', control
            assert control['fill'] == 'rgba(255, 255, 255, 0.18)', control
        assert '↗' not in page.locator('#instagram').inner_text()
        assert page.locator('.instagram-follow .instagram-logo').count() == 1
        assert page.locator('.instagram-logo').is_visible()
        assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
        assert not errors, errors
        for image in page.locator('#instagram img').all():
            image.scroll_into_view_if_needed()
            image.evaluate('(e)=>e.decode()')
        page.locator('#instagram').screenshot(path=str(OUT / f'controls-{width}.png'))
        print(json.dumps({'width': width, 'controls': controls, 'logo_visible': True, 'overflow': False}))
        page.close()
    browser.close()
print('PASS: centered large white translucent flat controls, no arrows, visible Instagram logo, responsive layout.')
