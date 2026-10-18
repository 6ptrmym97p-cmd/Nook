# Productreview Nook — 18 oktober 2026

De live website en de broncode zijn beoordeeld op ontwerp, mobiele bediening, kaartgedrag, toegankelijkheid, routeopslag en offline gebruik. De bestaande huisstijl en de kaartarchitectuur met canvaspins en een worker zijn behouden. De grootste problemen zaten in de bediening rondom de kaart en het bewaren van gebruikerskeuzes.

## Bevindingen en uitgevoerde verbeteringen

| Prioriteit | Vastgesteld probleem | Verbetering |
| --- | --- | --- |
| Hoog | Twee snelle tikken op de afstandskeuze eindigden op 15 km terwijl de tweede tik 70 km koos. De globale `touchend`-handler annuleerde de tweede actie. | Globale annulering verwijderd; browserzoom buiten de kaart blijft mogelijk. De kaart behoudt eigen touchgebaren. |
| Hoog | Een GPX met ongeldige waypointcoördinaten voegde `null` toe aan de routelijst en veroorzaakte een fout bij het renderen. | GPX-document en coördinaten worden gecontroleerd vóór toevoegen. Een eigen statusmelding blijft zichtbaar als kaartresultaten verversen. Bestanden boven 20 MB krijgen een duidelijke melding. |
| Hoog | GPX-import verving een handmatige landkeuze door alle landen. Een uitgeschakelde routefilter stond na herladen opnieuw aan. | Landkeuze blijft behouden; aan/uit van de routefilter wordt opgeslagen. |
| Hoog | Een mislukte opslag tijdens migratie kon de oude GPX verwijderen. | De oude opslag wordt pas verwijderd na een geslaagde nieuwe opslag. Een herstelprobleem wist de bestaande bibliotheek niet. |
| Hoog | Kleine schermen kregen tabellen van 9 px, verborgen officiële bronlinks en inhoud die door `overflow: hidden` onbereikbaar kon worden. | Normaal scrollende pagina's, tekst van minimaal 14 px in de tabellen, mobiele rijkaarten en alle bronlinks zichtbaar. |
| Hoog | De algemene cachegrens kon na veel kaarttegels ook de kaartindex verwijderen. Offline navigatie kon oude HTML verkiezen boven een nieuwe versie. | Tegels hebben een aparte begrensde cache. Kaartdata blijft behouden en offline pagina's komen uit de huidige app-versie. Cache-opruiming blijft beperkt tot Nook. |
| Midden | Een geopende filterlaag hield de toetsenbordfocus op de knop achter het paneel. | Native dialoog met focusbeheer, Escape en terugkeer naar de openknop. Gesloten detailpanelen zijn niet interactief. |
| Midden | Route-import zat onderaan een lang filterpaneel. | Directe knop **Mijn route**, duidelijke importactie op Routes en filters geordend op de gebruikersvraag. Het paneel heeft een vast zichtbare sluitactie en resetknop. |
| Midden | Navigeren naar een informatiepagina verloor het gekozen kaartbeeld. Routevinkjes wijzigden ook de kaartpositie. | Kaartpositie en zoom worden lokaal onthouden. Aan/uit en verwijderen van routes verplaatsen de kaart niet meer. |
| Midden | Een fout bij downloaden bood alleen herladen aan. Bij kandidaten kon de laadmelding blijven staan. | Zichtbare foutstatus met **Opnieuw proberen**, die de worker opnieuw start; kandidaten krijgen ook de foutmelding. |
| Midden | Een kleine verwijderknop wiste direct een opgeslagen route. | Groter aanraakvlak en **Herstellen** voor één of alle verwijderde routes, zolang de sessie open blijft. |
| Midden | De mobiele navigatie verborg Over; tekstcontrast in privacyblokken was te laag. | Over is bereikbaar in de mobiele navigatie; grotere aanraakvlakken, voldoende contrast, een overslaan-link en ondersteuning voor minder beweging. |

**Reset filters** bewaart de GPX-bibliotheek, afstandskeuze en onderkaartvoorkeur. Er worden geen bestaande gebruikersgegevens gewist bij het uitrollen van deze versie. Brondata en kaartcoördinaten zijn niet veranderd.

## Verificatie

- Elf native tests voor de volledige kaartindex, ruimtelijke clustering, routefilters, samenvallende locaties, touch-events en cachegedrag.
- Bestaande browsercontrole: kleine verschuivingen doen geen nieuwe kaartquery; echte canvas-tiks, snelle zoomtiks, knijpzoomen, toetsenbordfocus en onderkaartvoorkeur werken.
- Gebruikersroutes in Chromium met touch: import via de bestandskiezer, vijf ongeldige bestanden, bewaarde landkeuze en routefilter, verwijderen/herstellen, kaartbeeld bewaren, kandidaten en brongegevens, offline herladen en herstel na een geblokkeerde kaartdownload.
- Routemigratie met gesimuleerde volle browseropslag: de bestaande route blijft bewaard.
- Informatiepagina's op 320×568, 390×700, 844×390 en 1440×900: geen horizontale overloop, laatste rijen bereikbaar, bronlinks zichtbaar en tabeltekst minimaal 14 px.
- Axe-core 4.10.3, WCAG 2 A/AA en 2.1 AA: geen gevonden overtredingen op de kaart, filters, kandidaten en de vier informatiepagina's. Dit is een automatische controle, geen volledige toegankelijkheidsverklaring.
- Update van de vorige gepubliceerde versie getest op dezelfde browserorigin, met een bestaande GPX, voorkeuren en een cache van een andere app; daarna ook offline herladen.

Browsercontroles gebruiken geïsoleerde profielen en testbestanden. Ze veranderen geen routes of instellingen van echte bezoekers. Schermformaten en touch zijn gesimuleerd; fysieke iPhones en Android-toestellen zijn niet rechtstreeks getest. Er wordt geen uitspraak gedaan over een gemeten snelheidswinst op die apparaten.

## Verdere productkansen

1. **Zoeken naar een plaats of regio.** Nu start je met locatie, kaartbewegingen of een GPX. Een goede plaatszoeker is de grootste overgebleven verbetering voor mensen die elders willen plannen; daarvoor moet een passende zoekbron en diens gebruiksvoorwaarden worden gekozen.
2. **Brongegevens vernieuwen.** De kaartdata is een momentopname van 7 juli 2026. De datum is nu duidelijk zichtbaar bij Netwerken; beschikbaarheid en kosten blijven bij de bron te controleren. Deze review vernieuwt de dataset niet.
3. **Gebruikerstest tijdens een echte fietstocht.** Controleer met enkele fietsers of de afstandskeuze, de verschillende gastnetwerken en de betekenis van geclusterde aantallen begrijpelijk zijn. Test ook laag bereik, fel buitenlicht en bediening met één hand op fysieke toestellen.
4. **Routes meenemen naar een ander apparaat.** Bewaren gebeurt lokaal. Een export- of backupmogelijkheid voor de routebibliotheek zou verlies bij het wissen van browsergegevens helpen voorkomen.
