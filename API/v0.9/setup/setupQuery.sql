--
-- Table structure for table `competences`
--

CREATE TABLE IF NOT EXISTS `competences` (
  `id` binary(16) NOT NULL,
  `number` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Dumping data for table `competences`
--

INSERT INTO `competences` (`id`, `number`, `name`, `description`) VALUES
(0x01e1e6ae6b284deeab3b859cc91d544d, 34, 'Ví, kdo v Junáku může činit právní úkony.', 'Ví, kdo může činit právní úkony a v jakém rozsahu, zejména při běžné oddílové činnosti. Ví, jak může činit právní úkony organizační jednotka (statutární orgán, zastoupení). Ví, za jakých okolností může činit právní úkony jménem organizační jednotky (na základě zmocnění nebo při výkonu funkce).'),
(0x0d560ee5d8ea40669c94b0a2d901c69a, 32, 'Dbá na zajištění bezpečnosti účastníků na akcích.', 'Umí posoudit závažnost zdravotního stavu a dokáže provést laickou první pomoc (resuscitace, zástava masivního krvácení, zlomeniny, alergické reakce, tepelná poškození, šok, bezvědomí, běžné úrazy atd.). První pomoc zvládá teoreticky i prakticky. Zná bezpečnostní zásady poskytování první pomoci.'),
(0x0dbbd4f1272d4f5db91f96d8eee626f9, 16, 'Umí vhodně dramaturgicky sestavit program akce.', 'Umí, s ohledem na rizika i specifika, poskládat programy za sebe tak, aby docílil požadovaného efektu a cílů.'),
(0x110335aee0f74dc68e33f71d60886a88, 1, 'Ví, co je podstatou skautingu, ztotožňuje se s třemi Principy a posláním skautingu.', 'Chápe, že podstata skautingu je vyjádřena v Principech, poslání a metodě. Rozumí těmto pojmům, ztotožňuje se s hodnotami prezentovanými Principy i s myšlenkou poslání. Chápe, jak skautský zákon a slib vyjadřují tři Principy, a snaží se podle nich žít.Popis nové kompetence'),
(0x1b86befac7334fa390e917bc973d1ac5, 42, 'Ví, jak se hospodaří s majetkem a financemi v jeho oddíle.', 'Ví, komu patří majetek používaný oddílem a jakými pravidly se řídí hospodaření s tímto majetkem a svěřenými financemi. Ví, jak majetek vzniká, komu patří, jak a kde se berou peníze v oddíle a jak se s nimi hospodaří. Zná středisková a oddílová pravidla pro nakládání s majetkem, materiálem a financemi.'),
(0x246dd251ee3c49f3b00b9585bc116acd, 35, 'Ví, jaké důsledky má porušení práva.', 'Rozumí konceptu občanskoprávní, trestněprávní a správněprávní odpovědnosti za porušení právních povinností a zná praktické rozdíly mezi nimi. Ví, v čem spočívá odpovědnost za škodu. Ví, kdy může nést odpovědnost za škodu vzniklou při činnosti oddílu. Ví, kdo nese odpovědnost za škodu způsobenou nezletilými. Ví, že může být pojištěn na odpovědnost za škodu. Ví, za jakých podmínek ne/nese trestní odpovědnost. Ví, jak konkrétně se jej to týká, zejm. s ohledem na činnost oddílu.'),
(0x2986bb4f9cf04764a609b713d31d02d1, 31, 'Rozpozná život ohrožující stavy a další závažná poranění, poskytne první pomoc.', 'Umí posoudit závažnost zdravotního stavu a dokáže provést laickou první pomoc (resuscitace, zástava masivního krvácení, zlomeniny, alergické reakce, tepelná poškození, šok, bezvědomí, běžné úrazy atd.). První pomoc zvládá teoreticky i prakticky. Zná bezpečnostní zásady poskytování první pomoci.'),
(0x2bd7b9a0707847c08102f03ab0496610, 27, 'Uvědomuje si význam vztahů mezi členy družiny/oddílu.', 'Uvědomuje si, že družinu tvoří dobrá parta kamarádů. Dokáže stručně charakterizovat, jaké vlastnosti tato skupina nese, a ví, že volbou a zadáním programů může působit na podobu vztahů mezi členy.'),
(0x33ac5538f6164e4b84fdb639504f9dde, 38, 'Zná svoje středisko.', 'Zná svoje středisko - jeho název, sídlo, oddíly střediska a nejdůležitější činovníky v něm. Ví, jak by mělo středisko být řízeno a jak by mělo fungovat. Ví, jaké je postavení střediska v organizační struktuře Junáka.'),
(0x3b610421944d43fd8e5b0705be59dabe, 30, 'Umí se vhodně zachovat v krizové situaci.', 'Nastane-li krizová situace, dokáže se zorientovat, odhadnout svoji roli a vhodně reagovat. Umí přivolat pomoc, pokud je třeba. Zná zásady chování při požáru, úrazu, tonutí, převržení lodi, dopravní nehodě, nepřízni počasí, nedostatku jídla či pití, ztracení členů apod. Ví, jaká jsou doporučení a postupy v Junáku.'),
(0x44f3cb0a72e2499d80af69d9c852ac89, 17, 'Při realizaci programu umí reagovat na nečekané situace.', 'Zareaguje na nečekanou situaci a dovede smysluplně pozměnit plánovaný program. Nepoužívá improvizaci jako zástěrku nepřipravenosti. Umí rozeznat chvíli, kdy je lepší improvizovat, dovede provést dramaturgické změny a zdůvodní to. Při změnách v programu zachová jeho cíle.'),
(0x4513d28d7f7b4b619e6498d65631f19a, 24, 'Umí jednat s dětmi i dospělými.', 'Při komunikaci s dětmi i dospělými respektuje jejich charakteristiky. Zohledňuje mj. to, zda jedná se skautem či neskautem. Umí jednoduše a jasně sdělit informaci. Podle konkrétní situace volí např. jiný slovník, skladbu vět, tempo řeči...'),
(0x4e05bc2946004f75a4155c16994cb086, 11, 'Zná trendy ve světě dětí a sleduje dění ve světě dospělých.', 'Má základní představu o tom, co je pro děti IN. Zajímá se o aktuální fenomény - dětskou literaturu, filmy, seriály, nové hračky. Má přehled o nejdůležitějších událostech ve světě i u nás.Znalosti využívá při činnosti v oddíle.'),
(0x5d9fc55cae5c4ca1af6f83c3c6cb2ef5, 13, 'Rozumí jednotlivým částem skautské výchovné metody i metodě jako celku.', 'Ví, jakou roli ve skautingu hraje skautská výchovná metoda. Ví, k čemu je dobrá, zná její části (umí je popsat a uvést na příkladu), vědomě umí části metody začlenit do práce s oddílem. Její jednotlivé prvky dokáže najít v programu oddílu. Přijímá skautskou výchovnou metodu.'),
(0x60b9faacb4a44f0189ceccc0bc2f694f, 4, 'Dokáže popsat své motivy pro práci v Junáku – českém skautu.', 'Je si vědom, proč jako dobrovolník působí ve skautském hnutí a jaká je jeho role čekatele.'),
(0x655e396dc7f74ac4978d68f3ca57fb69, 20, 'Umí používat „Hodnocení kvality v Junáku“.', 'Posoudí, v jaké míře jeho oddíl naplňuje kritéria kvality, a zjištění chápe jako východisko ke zlepšení. O výsledcích je schopen diskutovat s vůdcem oddílu.'),
(0x67377ecf05b041a497acfdeeddc9a2e2, 14, 'Umí vhodně volit prostředky a používá nástroje skautské výchovy.', 'Ví, co je to prostředek, umí ho odlišit od cíle. Umí ke svým cílům najít i vytvořit vhodné prostředky, které jsou přiměřené, atraktivní a efektivní. Ví, jaké prostředky používá při činnosti oddílu, a proč je zařazuje. Zná základní nástroje skautské výchovy a snaží se s nimi pracovat.'),
(0x69fa3ec3586a43f4ae8eb12c57dd70d6, 12, 'Umí pracovat s krátkodobými cíli.', 'Umí formulovat krátkodobé cíle, nastavit jejich úroveň vzhledem k cílové skupině, je schopen je naplnit a zhodnotit, jestli cílů dosáhl a v jaké míře.'),
(0x6bd25702eda548feb4d4565241f3b33b, 25, 'Poznává jemu svěřené děti.', 'Všímá si svěřených dětí, zajímá se o ně, o jejich životní situaci i mimo skautský oddíl. Dokáže u nich pojmenovat jejich přednosti a možnosti dalšího rozvoje, respektuje jejich zvláštnosti.'),
(0x73fb0e234b304b819f1c97ee8202f61c, 22, 'Rozumí podstatě odměn a trestů jako nástrojům motivace a umí je vhodně využívat.', 'Ví, co to jsou odměny a tresty, jaké mohou mít přínosy a naopak zápory, podle čeho je volit, jaké zásady dodržovat při jejich používání.'),
(0x7415445095974ffbb1a1b0899e79c5cf, 8, 'Dokáže převzít roli vedoucího.', 'Příjmá svůj díl odpovědnosti za oddíl a je schopen a ochoten dočasně převzít roli vedoucího.'),
(0x80d006eaeb0143f385ceed012b4dbf22, 6, 'Vytváří fungující vztahy s lidmi okolo sebe.', 'Vytváří fungující vztahy s lidmi, které vede, i ke svým spolupracovníkům. Přistupuje k nim jako k jedinečným individualitám a respektuje je.'),
(0x81b108d427ab4032affd27d067a2b488, 40, 'Dokáže pracovat s účetními doklady.', 'Zná náležitosti prvotních dokladů. Zná a umí vyplnit příjmový a výdajový pokladní doklad.'),
(0x84a4c6fe79f44dfe8c5d3310a71e88c9, 36, 'Zná další právní předpisy vztahující se k oddílovému životu.', '\"Zná nejdůležitější povinnosti stanovené dalšími právními předpisy ve vztahu k typické činnosti oddílu, zejm. v oblastech:\n - užívání lesů,\n - ochrana přírody a krajiny,\n - ochrana osobních údajů a ochrana osobnosti,\n - provoz na pozemních komunikacích.\"'),
(0x8890ae540cd941ffb3759884eb8701dc, 10, 'Je pro děti vzorem, chová se podle toho a nezneužívá svého postavení.', 'Ví, že jako vzor hraje důležitou roli v utváření osobnosti dítěte. Nepřetvařuje se, není pokrytecký. Ze všech svých sil se snaží být lepším.'),
(0x92ac3fb4a4b64e4abdab9d9255906e7b, 7, 'Poznává sám sebe a všestranně se rozvíjí.', 'Uvědomuje si a hledá svoje silné a slabé stránky a všestranně se rozvíjí. Umí zhodnotit, na co stačí jeho schopnosti.'),
(0x9485100dc4654dcdbb849cc93aac6a12, 23, 'Připravované programy přizpůsobuje cílovým skupinám.', 'Ví, jaká jsou specifika práce s dětmi jednotlivých věkových kategorií a respektuje to při přípravě programu. Uvědomuje si odlišný styl práce ve věkově/pohlavně smíšeném kolektivu.'),
(0x9554a3af0c6a4970915a9a6099adbc75, 29, 'Zvažuje potenciální rizika a snaží se jim předcházet.', 'Zná rizika, která přináší pobyt v klubovně či v přírodě, ale i specifické činnosti zde prováděné (kolo, koupání, přesun po silnici, noční pochod atd.). Zná požadavky na personální a technické zajištění rizikových aktivit (koupání, pohyb po silnici, cyklistika, lanové aktivity, vodácké akce apod.).'),
(0x9876b03604864057aeb8a66097e88a92, 28, 'Zná a zohledňuje doporučené limity pro práci s dětmi.', 'Ví, jaké psychické a fyzické limity jsou nastaveny pro činnost s dětmi. Zohledňuje je v činnosti oddílu s ohledem na aktuální situaci. Má přehled o omezeních jemu svěřených dětí a umí tomu vhodně přizpůsobit program.'),
(0xa0e383f5b2074491982a26ac41fa91c0, 2, 'Zná historii skautingu a jeho vztahu ke společnosti.', 'Ví z jakých kořenů skauting vychází, jaká je jeho historie a jaká byla a je jeho role ve společnosti.'),
(0xae8c291f3e674f7fa7591fc8200ada0c, 9, 'Je schopen přijímat konstruktivní kritiku.', 'Chápe, kdy je cílem kritiky poukázat na \"prostor ke zlepšení\", umí posoudit oprávněnost vznesených námětů, přijmout je a vzít si z nich to nejlepší.'),
(0xb716cb314a5146979501c9980452bdcc, 18, 'Umí zpětně porovnat plán programu s jeho realizací a poučit se z toho.', 'Je schopen zpětně porovnat připravený plán s průběhem akce, dokáže popsat rozdíly a vyvodit z nich důsledky pro přípravu příštích akcí.'),
(0xb737ed17f1ca4ad5a173bf7653a546d5, 19, 'Umí zorganizovat činnost/práci a vhodně rozdělí úkoly ostatním.', 'Uvědomuje si, že ne všechnu svěřenou práci zvládne vykonat sám. Umí ostatním vhodně rozdělit úkoly, dostatečně je vysvětlit. Pohlídá jejich splnění.'),
(0xb8b4c9bd7add418a89ae5f23a9a69883, 21, 'Umí vhodnou formou dát, získat a využít zpětnou vazbu.', 'Ví, že zpětná vazba je důležitým prostředkem práce s členy oddílu. Ví, jaké má mít náležitosti, aby byla přínosná a aby neuškodila. Umí ji poskytnout i přijmout (získat ji - např. pozorováním, nasloucháním...). S výsledky umí vhodně naložit.'),
(0xca3e0d2de15e47b884586d7ce106fcf9, 41, 'Ovládá hospodaření malé akce.', 'Umí sestavit rozpočet malé akce, vést evidenci pokladní hotovosti a sestavit přehled příjmů a výdajů akce.'),
(0xcf9532f78e024900af60fb626d1fa185, 37, 'Zná Stanovy Junáka.', 'Seznámí se se Stanovami Junáka, zná jejich stručný obsah.'),
(0xd5e89ac3eb3f4c8cb331b006f9206d96, 3, 'Dokáže vysvětlit proč je skautem, a dokáže se za skauting postavit.', 'Ví, proč jej oslovují myšlenky a ideje skautingu. Dokáže skauting přiměřeně prezentovat a zastat se jej před druhými.'),
(0xe454eb47007547eda77c400e0b3d5b81, 26, 'Dokáže poznat, že se chování jemu svěřeného dítěte změnilo, a upozornit na to.', 'Dokáže u svého svěřence rozpoznat, že se chová jinak než obvykle nebo že se ocitl v problémové situaci, a přiměřeně na to zareaguje. (Dítě např. začne být plačtivé, nadměrně agresivní, úzkostné, i když takové nebývalo.) Ví, že on sám nemůže v takových závažných případech poskytnout dítěti pomoc, ale že musí upozornit vedoucího, který situaci vyřeší,'),
(0xe764d239d5eb4cde9a49a77d63287672, 33, 'Ví, kdo má právní subjektivitu a v čem spočívá.', 'Ví, kdo je nositelem práv a povinností. Dokáže vysvětlit rozdíl mezi fyzickou a právnickou osobou. Ví, které jednotky mají právní subjektivitu a v čem tato praticky spočívá (např. otázka vlastnictví vybavení užívaného při oddílové činnosti).'),
(0xecbd32e06ffa45598e6481948a001669, 5, 'Umí si hrát.', 'Umí se zapojit do aktivity se svými svěřenci. Umí si užít situaci, kdy je účastníkem nějaké činnosti.'),
(0xf7e4bd88b9a54568b861734c1fde9888, 39, 'Využívá skautské informační zdroje.', 'Zná skautské weby a časopisy. Umí najít potřebné skautské předpisy a formuláře, informace o organizaci, oddílech, akcích, základnách apod. Umí pracovat se skautISem.'),
(0xfb3c3b19045e4287af81729a44d3a476, 15, 'Umí pracovat s oficiální stezkou.', 'Rozumí jednotlivým principům stezky, umí ji začlenit do programů oddílu. Používá-li jeho oddíl vlastní stezku, umí pojmenovat její výhody a nedostatky.');

--
-- Table structure for table `competences_for_lessons`
--

CREATE TABLE IF NOT EXISTS `competences_for_lessons` (
  `lesson_id` binary(16) NOT NULL,
  `competence_id` binary(16) NOT NULL,
  KEY `lesson_id` (`lesson_id`) USING BTREE,
  KEY `competence_id` (`competence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Table structure for table `deleted_lessons`
--

CREATE TABLE IF NOT EXISTS `deleted_lessons` (
  `id` binary(16) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `version` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Table structure for table `fields`
--

CREATE TABLE IF NOT EXISTS `fields` (
  `id` binary(16) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Dumping data for table `fields`
--

INSERT INTO `fields` (`id`, `name`) VALUES
(0x12e594cedd3548e9befba440e0403762, 'Hospodaření'),
(0x1db1540ff8294b449c013cb9ecd56fa1, 'Zdravověda a bezpečnost'),
(0x26399db899e84e909309ccd2937d3544, 'Právo'),
(0x29d7c37f9d674e2086d74ae8846fb931, 'Organizace'),
(0x2e5bf7bba48f497f881c230ccb7fce56, 'Osobnost čekatele'),
(0x4919e4b8da7140da9d0f2e96261a0e42, 'Příprava programu, metodika skautské výchovy'),
(0x834e889c03664959a6f674707a33c1ce, 'Skauting'),
(0xdd8ac1b9b22241788715e826167cdfce, 'Pedagogika, psychologie a komunikace');

--
-- Table structure for table `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `id` binary(16) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `name`) VALUES
(0x00000000000000000000000000000000, 'Veřejné');

--
-- Table structure for table `groups_for_lessons`
--

CREATE TABLE IF NOT EXISTS `groups_for_lessons` (
  `lesson_id` binary(16) NOT NULL,
  `group_id` binary(16) NOT NULL,
  KEY `lesson_id` (`lesson_id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Table structure for table `images`
--

CREATE TABLE IF NOT EXISTS `images` (
  `id` binary(16) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `time`) VALUES

--
-- Table structure for table `lessons`
--

CREATE TABLE IF NOT EXISTS `lessons` (
  `id` binary(16) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `version` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Table structure for table `lessons_in_fields`
--

CREATE TABLE IF NOT EXISTS `lessons_in_fields` (
  `field_id` binary(16) NOT NULL,
  `lesson_id` binary(16) NOT NULL,
  UNIQUE KEY `lesson_id` (`lesson_id`) USING BTREE,
  KEY `field_id` (`field_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `role` enum('user','editor','administrator','superuser') CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ID` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `role`) VALUES
(125099, 'Dědič Marek (Mlha)', 'superuser');

--
-- Table structure for table `users_in_groups`
--

CREATE TABLE IF NOT EXISTS `users_in_groups` (
  `user_id` int(11) UNSIGNED NOT NULL,
  `group_id` binary(16) NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Indexes for table `deleted_lessons`
--
ALTER TABLE `deleted_lessons` ADD FULLTEXT KEY `body` (`body`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons` ADD FULLTEXT KEY `body` (`body`);

--
-- Constraints for table `competences_for_lessons`
--
ALTER TABLE `competences_for_lessons`
  ADD CONSTRAINT `competences_for_lessons_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `competences_for_lessons_ibfk_2` FOREIGN KEY (`competence_id`) REFERENCES `competences` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `groups_for_lessons`
--
ALTER TABLE `groups_for_lessons`
  ADD CONSTRAINT `groups_for_lessons_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `groups_for_lessons_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lessons_in_fields`
--
ALTER TABLE `lessons_in_fields`
  ADD CONSTRAINT `lessons_in_fields_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lessons_in_fields_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users_in_groups`
--
ALTER TABLE `users_in_groups`
  ADD CONSTRAINT `users_in_groups_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_in_groups_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
