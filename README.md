
# Opis projektu
Naszym projektem jest system zarządzania jednostką penitencjarną. Umożliwia on przetrzymywanie wszystkich najważniejszych informacji zarówno o personelu, jak i o osadzonych w placówce. W bazie przetrzymuje się również większość historycznych danych, tak więc w łatwy sposób można dostać się również do informacji o byłych więźniach i pracownikach. Aplikacja, która demonstruje możliwości naszej bazy dostępna jest **[tutaj](https://id.jakubbinieda.omg.lol)**.

Projekt został stworzony przez:
 - **[Jakub Binięda](https://github.com/jakubbinieda)**
 - **[Mateusz Hurkała](https://github.com/prolik123)**
 - **[Maciej Sanocki](https://github.com/msanock)**

## Opis bazy
![Schema](https://github.com/jakubbinieda/idWiezienie/blob/main/images/schema.png?raw=true)
Baza dancych składa się z 25 tabel, które zostaną po krótce omówione poniżej
### Więźniowie i pracownicy
Każdy więzień i pracownik gdy przychodzi do naszego więzienia zyostaje dodany do  tabel więźniowie i pracownicy. Przetrzymujemy jego podstawowe dane oraz nadajemy mu unikalny numer id. 
### Historia_wiezniowie i historia_pracownicy
Przetrzymujemy również wszystkie historyczne dane. Trzymamy daty przyjścia osoby oraz datę zakończenia pobytu. Dla więźniów te powody mogą być różne i musimy to odnotowywać, do czego służą tabele **powod_zakonczenia** i **powody_zakonczenia_rodzaje**. Dla pracowników działa to delikatnie inaczej, jako że każda zmiana stanowiska (stanowiska znajdują się w tabeli **stanowiska**) lub przełożonego również jest odnotowywana. Bardzo to pomaga, jako że gdy pracownik wraca do nas po przerwie lub więzień ponownie trafia do naszej placówki, nie tworzymy go od nowa, a jedynie dodajemy jedynie wpis do tych tabel. Umożliwia to dostęp do historycznych danych osoby w dowolnej chwili.
### Wiezniowie_wyroki i historia_wyroku
Gdy więzień do nas trafia to musimy wiedzieć za co został do nas wysłany oraz na ile. Jest to bardzo wygodne, jako że gdy wyrok się zmienia wystarczy zmienić lub dodać wpis do historia_wyroku. 
### Wiezniowie_cele, cele i bloki
Każdy skazany musi być gdzieś zakwaterowany. Zostaje mu przypisana cela oraz zapisujemy kiedy został do niej przeniesiony. W razie zmiany przypisujemy dodatkowo datę zakończenia pobytu w danej celi. Możemy dzięki temu sprawdzić, w których celach był więzień podczas pobytu u nas, nawet jak już wyszedł z więzienia. Cele mają numery i znajdują się na pewnym piętrze danego bloku posiada ona również limit więźniów, którzy mogą być w niej zakwaterowani. Każdy blok ma swoją nazwę i ustaloną liczbę pięter (parter to piętro 0).
### Wiezniowie_prace i prace_spoleczne
Czasem więzień chce (lub musi) brać udział w pracach społecznych. W takim wypadku zostaje on wpisany do danej pracy i zostaje mu przypisany zespół, który będzie go pilnował. Każda praca ma maksymalną liczbę uczestników, tak więc więźniowie muszą się spieszyć, żeby w niej uczestniczyć.
### Sprawowanie
Niektórzy osadzeni wyróżniają się swoim zachowaniem (niekoniecznie pozytywnie). Zostaje mu wtedy wpisane sprawowanie. Może ono być dobre(D) lub niedobre(N), w zależności od tego co zrobił. Każdy wpis ma również swoją wagę. Przykładowo uratownie komuś życia jest warte więcej niż umycie zębów.
### Wiezniowie_gangi i gangi
 Więźniowie mają w zwyczaju dobierać się w grupy, które nazywamy gangami. Notujemy kiedy dany osadzony dołączył do danego kolektywu, oraz ewentualnie kiedy z niego odszedł. Gangi nadają sobie nazwy i w celu rozróżniania swoich członków mają pewny znak rozpoznawczy. 
### Historia_liderow i relacje_gangi
Gangi niestety mają różne podejścia do siebie. Mogą one mieć różne relacje, które mogą być pozytywne(P) lub negatywne(N). Grupy lubią przypisywać sobie lidera(ów). Notujemy od kiedy do kiedy dany osadzony był liderem danego gangu.
### Pracownicy_nieobecnosci i powody_nieobecnosci
Każdemy czasem może nie być w pracy. Notujemy wtedy niebecność danego pracownika i daty w których nie może być obecny. Powody mogą być różne, niektóre są płatne, a inne nie. Każdy ma swój rodzaj i opis. 
### Pracownicy_zmiany i zmiany
Nasz zakład operuje zmianowo. Każdy pacownik jest przypisany do pewnych zmian, które pracują w dany dzień o danych godzinach.
### Pracownicy_zespoly i zespoly
Każdy pracownik jest częścią jakiegoś zespołu. Zapisujemy od kiedy do kiedy był częścią danej grupy. Każdy zespół jest przypisany na piętro danego bloku. 

## Poradnik po aplikacji
Aplikacja jest dość intuicyjna, tak więc niektóre aspekty mogą nie zostać dogłębnie wyjaśnione.
### Menu
![navbar](https://github.com/jakubbinieda/idWiezienie/blob/main/images/navbar.png?raw=true)
W celu poruszania się po stronie używamy menu, które znajduje się na górze ekranu. Jak widzimy aplikacja składa się z pięciu podstron. W celu zmienienia podstrony należy przycisnąć daną podstronę. 
### Strona główna
![dashboard](https://github.com/jakubbinieda/idWiezienie/blob/main/images/dashboard.png?raw=true)
Strona główna lub deska rodzielcza umożliwia nam przegląd podstawowych statystyk naszego więzienia. Możemy przeczytać
 - Ile więźniów przybyło dzisiaj 
 - Historyczne statystyki naszej placówki
 - W jakim stopniu cele są zepłnione
 - Ilu pracowników jest na urlopie
 - Ilu więźniów jest w gangach
### Więźniowie
Podstrona więźniowie umożliwia nam wiele operacji na więźniach.
![search](https://github.com/jakubbinieda/idWiezienie/blob/main/images/prisonerSearch.png?raw=true)
Pierwsze co widzimy to okno, które umożliwia nam przeszukiwanie więźniów. Możemy przeszukiwać się po dowolnym polu. W wypadku nie wpisania żadnego zostaną wypisani wszyscy więźniowie. Możemy również dodać więźnia, ale o tym za chwilę.
![list](https://github.com/jakubbinieda/idWiezienie/blob/main/images/prisonerList.png?raw=true)
Poniżej widzimy listę więźniów, którzy pasują do naszych wyszukiwań. Przyciskając w dowolny link możemy przejść do strony profilowej więźnia.
![edit](https://github.com/jakubbinieda/idWiezienie/blob/main/images/prisonerChange.png?raw=true)
![history](https://github.com/jakubbinieda/idWiezienie/blob/main/images/prisonerHistory.png?raw=true) 
Będąc już na profilu możemy edytować podstawowe dane osadzonego, jak i wyświetlić jego historię i dane, które uznaliśmy za ciekawe.
![things](https://github.com/jakubbinieda/idWiezienie/blob/main/images/prisonerThings.png?raw=true)
Możemy również przeprowadzać różne operacje takie jak wypuszczenie, czy zmiana celi.
![creator](https://github.com/jakubbinieda/idWiezienie/blob/main/images/prisonerCreator.png?raw=true)
Wracając do dodawania więźnia, które zostało wspomniane wcześniej. Możemy tutaj dodać skazanego. Warto dodać że po tej operacji zostanie on jedynie dodany do bazy, nie będzie miał wyroku.
## Gangi i pracownicy
Te dwie podstrony działają identycznie do tej więźniów, tak więc pozwolę sobie pominąć tłumaczenie.
## Zaawansowane
![advanced](https://github.com/jakubbinieda/idWiezienie/blob/main/images/advanced.png?raw=true)
To okno pozwala nam przeprowadzić zaawansowane operacje na bazie. Wymaga to wiedzy PostgreSQL. Jest to bardzo niebezpieczne i nie do końca przetestowane. 

> Użycie znaku procent % w zapytaniu powoduje, że serwer się wyłącza. Jest to związane ze sposobem przekazywania zapytań pomiędzy klientem a serwerem, gdzie spacja jest oznaczana przez '%20'. Jest to słabość NodeJS i mojej niekompetencji w tworzeniu aplikacji, a nie samej bazy.

## Instalacja
Nie zaleca się pobierać tego na własną rękę, ale jeżeli jest taka konieczność to należy wykonać poniższe komendy:
```
git clone https://github.com/jakubbinieda/idWiezienie.git
cd idWiezienie
npm install
cd client 
npm install
```

Wymaga to posiadania na swojej maszynie zainstalowanego NodeJS, NPM i PostgreSQL. Wymagana jest również konfiguracja pliku `/idWiezienie/client/models/dbModel.js` Należy tam wpisać dane z lokalnego PostgreSQL.

Żeby uruchomić należy użyć komend
```
npm run build
npm run start
```

Pliki z danymi znajdują się w folderze `data`
