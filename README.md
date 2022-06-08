
# Opis projektu
System zarządzania jednostką penitencjarną.

 - **[Jakub Binięda](https://github.com/jakubbinieda)**
 - **[Mateusz Hurkała](https://github.com/prolik123)**
 - **[Maciej Sanocki](https://github.com/msanock)**

## Opis bazy
![Schema](https://github.com/jakubbinieda/idWiezienie/blob/main/images/schema.png?raw=true)
Baza dancych składa się z 25 tabel, które zostaną po krótce omówione poniżej
### Więźniowie i pracownicy
Każdy więzień i pracownik gdy przychodzi do naszego więzienia zyostaje dodany do  tabel więźniowie i pracownicy. Przetrzymujemy jego podstawowe dane oraz nadajemy mu unikalny numer id. 
### Historia_wiezniowie i historia_pracownicy
Przetrzymujemy również wszystkie historyczne dane. Trzymamy daty przyjścia osoby oraz datę zakończenia pobytu. Dla więźniów te powody mogą być różne i musimy to odnotowywać, do czego służą tabele **powod_zakonczenia** i **powody_zakonczenia_rodzaje**. Dla pracowników działa to delikatnie inaczej, jako że każda zmiana stanowiska lub przełożonego również jest odnotowywana. Jest to bardzo wygodne, jako że gdy pracownik wraca do nas po przerwie lub więzień ponownie trafia do naszej placówki, nie tworzymy go od nowa, a jedynie dodajemy jedynie wpis do tych tabel. Umożliwia to dostęp do historycznych danych osoby w dowolnej chwili.
### Wiezniowie_wyroki i historia_wyroku
Gdy więzień do nas trafia to musimy wiedzieć za co został do nas wysłany oraz na ile. Jest to bardzo wygodne, jako że gdy wyrok się zmienia wystarczy zmienić lub dodać wpis do historia_wyroku. 
### Wiezniowie_cele, cele i bloki
Każdy skazany musi być gdzieś zakwaterowany. Zostaje mu przypisana cela oraz zapisujemy kiedy został do niej przeniesiony. W razie zmiany przypisujemy dodatkowo datę zakończenia pobytu w danej celi. Możemy dzięki temu sprawdzić, w których celach był więzień podczas pobytu u nas, nawet jak już wyszedł z więzienia. Cele mają numery i znajdują się na pewnym piętrze danego bloku posiada ona również limit więźniów, którzy mogą być w niej zakwaterowani. Każdy blok ma swoją nazwę i ustaloną liczbę pięter (parter to piętro 0).
### Wiezniowie_prace i prace_spoleczne
Czasem więzień chce (lub musi) brać udział w pracach społecznych. W takim wypaadku zostaje on wpisany do danej pracy i zostaje mu przypisany zespół, który będzie go pilnował. Każda praca ma maksymalną liczbę uczestników, tak więc więźniowie muszą się spieszyć, żeby w niej uczestniczyć.
### Sprawowanie
Niektórzy osadzeni wyróżniają się swoim zachowaniem (niekoniecznie pozytywnie). Zostaje mu wtedy wpisane sprawowanie. Może ono być dobre(D) lub niedobre(N), w zależności od tego co zrobił. Każdy wpis ma również swoją wagę. Przykładowo uratownie komuś życia jest warte więcej niż umycie zębów.
### Wiezniowie_gangi i gangi
 Więźniowie mają w zwyczaju dobierać się w grupy, które nazywamy gangami. Notujemy kiedy dany osadzony dołączył do danego kolektywu, oraz ewentualnie kiedy z niego odszedł. Gangi nadają sobie nazwy i w celu rozróżniania swoich członków mają pewny znak rozpoznawczy. 
### Historia_liderow i relacje_gangi
Gangi niestety mają różne podejścia do siebie. Mogą one mieć różne relacje, które mogą być pozytywne(P) lub negatywne(N). Grupy lubią przypisywać sobie lidera(ów). Notujemy od kiedy do kiedy dany osadzony był liderem danego gangu.
### Pracownicy_nieobecnosci i powody_nieobecnosci
Każdemy czasem nie może być w pracy. Notujemy wtedy niebecność danego pracownika i daty w których nie może być obecny. Powody mogą być różne, niektóre są płatne, a inne nie. Każdy ma swój rodzaj i opis. 
### Pracownicy_zmiany i zmiany
Nasz zakład operuje zmianowo. Każdy pacownik jest przypisany do pewnych zmian, które pracują w dany dzień o danych godzinach.
### Pracownicy_zespoly i zespoly
Każdy pracownik jest częścią jakiegoś zespołu. Zapisujemy od kiedy do kiedy był częścią danej ekipy. Każdy zespół jest przypisany na piętro danego bloku. 
