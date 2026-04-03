# Wordle: 8 Marca Dzien Kobiet Edition

Specjalna polska edycja Wordle przygotowana na Dzien Kobiet.

## Jak grac

Masz 6 prob na odgadniecie 5-literowego hasla.
Po wpisaniu slowa nacisnij `Dalej` albo Enter.

## Slownik

Gra korzysta z 5-literowych hasel wyodrebnionych ze slownika `class_a.txt`.
Dzienne haslo rotuje stabilnie po calej puli slow, zamiast resetowac sie do pierwszego wpisu.
Gra uzywa pelnych polskich znakow diakrytycznych w haslach i wpisach, bez upraszczania do ASCII.

## Kolory

Zielony oznacza poprawna litere na poprawnym miejscu.
Zloty oznacza poprawna litere na zlym miejscu.
Ciemny oznacza litere spoza hasla.

## Funkcje

- Klawiatura ekranowa z polskimi znakami diakrytycznymi
- Rotacja haseł z zapamiętywaniem postępu w localStorage
- Statystyki gry (rozegrane, wygrane, serie, rozkład prób)
- Przycisk "Następna gra" po zakończeniu rundy
- Udostępnianie wyników (kopiowanie siatki emoji do schowka)
- Animowane przysłowia polskie w nagłówku
