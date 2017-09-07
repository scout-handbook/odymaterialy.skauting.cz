var defaultName = "Nová lekce";

var defaultBody = "# Velký nadpis\n\
\n\
## Menší nadpis\n\
\n\
### Ještě menší nadpis\n\
\n\
#### a tak dál...\n\
\n\
##### až po\n\
\n\
###### Nejmenší nadpis\n\
\n\
Když píšu text, tak se automaticky dělají odstavce, kde když tam bude spousta textu tak se to samozřejmě samo dá  na nový řádek, ale když nový\n\
řádek udělám sám, tak to nevadí. Když chci\n\
\n\
začít nový odstavec, musím vynechat jeden řádek. Můžu udělat kus textu *kurzívou, když okolo něj dám hvězdičky*, nebo taky **tučně dvojitýma hvězdičkama** a nebo i ***tučně a kurzívou***.\n\
\n\
- Můžu\n\
- Dělat\n\
* Seznamy\n\
\n\
1. A taky\n\
2. číslované\n\
3. a dokonce\n\
    - vnořené\n\
    - seznamy\n\
        - hodně\n\
        - hluboko\n\
\n\
Můžu do textu vložit [odkaz](http://tiny.cc/PAIN), i když ten nevím, jak bych ho vytisknul :D. Fungují i obrázky:\n\
\n\
![Text po najetí kurzorem](https://odymaterialy.skauting.cz/API/v0.9/image/590e43e4-e2ed-47c1-8520-2d3a9c594efd)\n\
\n\
Akorát jsem ještě neudělal nahrávání vlastních (a vlastně nevím, jak je vytisknout, tak mi je asi budete muset poslat...)...\n\
\n\
Pak taky můzu udělat něco jako\n\
\n\
 > citaci,\n\
 > která bude odsazená, ale nevím, jestli to je k něčemu dobré...\n\
\n\
\n\
No a taky můžu dělat tabulky:\n\
\n\
| Tables        | Are           | Cool  |\n\
| ------------- |:-------------:| -----:|\n\
| col 3 is      | right-aligned | $1600 |\n\
| col 2 is      | centered      |   $12 |\n\
| zebra stripes | are neat      |    $1 |\n\
\n\
Pod hlavičkou musí být řada pomlček (aspoň 3 v kadém sloupci) a můžu tam použít : k zarovnání vlevo, na střed nebo doprava.\n\
\n\
Ve skutečnosti se s tím nemusím piplat a stačí i tohle:\n\
\n\
Markdown | Less | Pretty\n\
--- | --- | ---\n\
*Still* | **renders** | ***nicely***\n\
1 | 2 | 3\n\
\n\
A pro opravdové fajnšmekry můžu dělat v textu i místo na poznámky (zatím použitelné jenom v tisku):\n\
\n\
!notes[style=blank, height=3]\n\
\n\
mi udělá tři prázdné řádky, nebo můžu:\n\
\n\
!notes[style=dotted, height = 5]\n\
\n\
udělat takové ty vytečkované řádky (tady 5 řádků), nebo taky\n\
\n\
!notes[style=dotted,height=eop]\n\
\n\
tečkované řádky až do konce stránky (End Of Page), s tím malým detailem, že jak ta stránka vypadá, tu zatím nikde není vidět, to musím ještě nějak vymyslet...."
