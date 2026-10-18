# Eigen domein

Nook gebruikt `ridewithnook.com` als domein. Het bestand `CNAME` in de root van de publicatiebranch legt dit vast voor GitHub Pages. De website, kaartgegevens, navigatie en PWA gebruiken relatieve paden, zodat ze ook vanaf de root van het eigen domein werken.

## Cloudflare

Open **ridewithnook.com → DNS → Records** en gebruik deze webrecords:

| Type | Naam | Waarde | Proxystatus |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `6ptrmym97p-cmd.github.io` | DNS only |

Kies bij alle records het grijze wolkje (**DNS only**) en automatische TTL. Verwijder uitsluitend bestaande conflicterende A-, AAAA- of CNAME-records voor `@` en `www`; laat mail- en verificatierecords staan. Het doel van de CNAME bevat geen `https://` en geen `/Nook/`.

## GitHub Pages

Controleer in [Settings → Pages](https://github.com/6ptrmym97p-cmd/Nook/settings/pages) dat de publicatiebron `main` en `/ (root)` is en **Custom domain** op `ridewithnook.com` staat. Bij publicatie vanuit een branch wordt het domein via het bestand `CNAME` ingesteld; bij een eventuele overstap naar een eigen Actions-workflow moet het ook in de Pages-instellingen blijven staan.

GitHub controleert de DNS en vraagt daarna het HTTPS-certificaat aan. Zet **Enforce HTTPS** aan zodra die optie beschikbaar is. GitHub meldt dat DNS-wijzigingen tot 24 uur en een HTTPS-certificaat tot een uur kunnen kosten.

## Controle na koppeling

- `https://ridewithnook.com/` opent de kaart met plekken.
- `https://www.ridewithnook.com/` komt uit op hetzelfde hoofddomein.
- Het oude GitHub Pages-adres verwijst door naar het nieuwe domein.
- Navigatie, eigen GPX-route, plekdetails en offline herladen werken vanaf de nieuwe root.

De domeinregistratie, Cloudflare DNS en GitHub Pages-instelling zijn afzonderlijke stappen. Alleen het toevoegen van `CNAME` bevestigt niet dat DNS of HTTPS al werken.

Bron: [GitHub-documentatie over eigen domeinen](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
