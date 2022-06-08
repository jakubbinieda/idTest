--drop SEQUENCE "public".pracownicy_id_pracownika_seq;
CREATE SEQUENCE "public".pracownicy_id_pracownika_seq START WITH 1 INCREMENT BY 1;

--drop SEQUENCE "public".stanowiska_id_stanowiska_seq;
CREATE SEQUENCE "public".stanowiska_id_stanowiska_seq START WITH 1 INCREMENT BY 1;

--drop SEQUENCE "public".wiezniowie_id_wieznia_seq;
CREATE SEQUENCE "public".wiezniowie_id_wieznia_seq START WITH 1 INCREMENT BY 1;

--drop SEQUENCE "public".powod_zakonczenia_id_powodu_seq;
CREATE SEQUENCE "public".powod_zakonczenia_id_powodu_seq START WITH 1 INCREMENT BY 1;

--drop SEQUENCE "public".wiezniowie_wyroki_id_wyroku_seq;
CREATE SEQUENCE "public".wiezniowie_wyroki_id_wyroku_seq START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE "public".gangi_id_gangu_seq START WITH 1 INCREMENT BY 1;

CREATE  TABLE "public".bloki ( 
	id_bloku             numeric  NOT NULL  ,
	nazwa                varchar(1)  NOT NULL  ,
	liczba_pieter        numeric  NOT NULL  ,
	plec char(1) NOT NULL,
	CONSTRAINT pk_bloki PRIMARY KEY ( id_bloku )
 );

CREATE  TABLE "public".cele ( 
	nr_celi              numeric  NOT NULL  ,
	blok                 numeric  NOT NULL  ,
	pietro               numeric  NOT NULL  ,
	limit_os             numeric  NOT NULL  ,
	CONSTRAINT pk_cele PRIMARY KEY ( nr_celi ),
	CONSTRAINT fk_cele_bloki FOREIGN KEY ( blok ) REFERENCES "public".bloki( id_bloku )   
 );

CREATE  TABLE "public".gangi ( 
	id_gangu             numeric DEFAULT nextval('gangi_id_gangu_seq'::regclass) NOT NULL  ,
	nazwa                varchar(100)  NOT NULL  ,
	znak_rozpoznawczy    varchar(100)  NOT NULL  ,
	CONSTRAINT pk_gangi PRIMARY KEY ( id_gangu )
 );

CREATE  TABLE "public".powody_zakonczenia_rodzaje ( 
	id_rodzaju           numeric  NOT NULL  ,
	nazwa                varchar(40)    ,
	CONSTRAINT pk_powody_zakonczenia_rodzaje PRIMARY KEY ( id_rodzaju )
 );

CREATE  TABLE "public".powod_zakonczenia ( 
	id_powodu            numeric DEFAULT nextval('powod_zakonczenia_id_powodu_seq'::regclass) NOT NULL  ,
	rodzaj               numeric  NOT NULL  ,
	opis                 varchar(400)  NOT NULL  ,
	CONSTRAINT pk_powod_zakonczenia PRIMARY KEY ( id_powodu )
 );

CREATE  TABLE "public".powody_nieobecnosci ( 
	id_powodu_nieob      numeric  NOT NULL  ,
	opis                 varchar(500)  NOT NULL  ,
	rodzaj               char(1)  NOT NULL  ,
	platny               numeric(3,2) DEFAULT 0.00 NOT NULL  ,
	CONSTRAINT pk_powody_nieobecnosci PRIMARY KEY ( id_powodu_nieob )
 );

CREATE  TABLE "public".prace_spoleczne ( 
	id_pracy             numeric  NOT NULL  ,
	nazwa                varchar(100)  NOT NULL  ,
	opis                 varchar(500)  NOT NULL  ,
	max_liczba_os        numeric  NOT NULL  ,
	CONSTRAINT pk_prace_spoleczne PRIMARY KEY ( id_pracy )
 );

CREATE  TABLE "public".relacje_gangi ( 
	id_gangu_1           numeric  NOT NULL  ,
	id_gangu_2           numeric  NOT NULL  ,
	typ_relacji          char(1)  NOT NULL  ,
	CONSTRAINT pk_relacje_gangi PRIMARY KEY ( id_gangu_1, id_gangu_2 ),
	CONSTRAINT fk_relacje_gangi2 FOREIGN KEY ( id_gangu_2 ) REFERENCES "public".gangi( id_gangu )   ,
	CONSTRAINT fk_relacje_gangi_gangi FOREIGN KEY ( id_gangu_1 ) REFERENCES "public".gangi( id_gangu )   
 );

CREATE  TABLE "public".stanowiska ( 
	nazwa                varchar(100)  NOT NULL  ,
	id_stanowiska        numeric DEFAULT nextval('stanowiska_id_stanowiska_seq'::regclass) NOT NULL  ,
	CONSTRAINT pk_stanowiska PRIMARY KEY ( id_stanowiska )
 );

CREATE  TABLE "public".wiezniowie ( 
	id_wieznia           numeric DEFAULT nextval('wiezniowie_id_wieznia_seq'::regclass) NOT NULL  ,
	imie                 varchar(40)  NOT NULL  ,
	nazwisko             varchar(40)  NOT NULL  ,
	pesel                char(11)  NOT NULL  ,
	plec                 char(1)  NOT NULL  ,
	data_urodzenia       date  NOT NULL  ,
	CONSTRAINT pk_wiezniowie PRIMARY KEY ( id_wieznia ),
	CONSTRAINT pesel_alias UNIQUE ( pesel ) 
 );

CREATE  TABLE "public".wiezniowie_cele ( 
	id_wieznia           numeric  NOT NULL  ,
	nr_celi              numeric  NOT NULL  ,
	data_wyprowadzki     date    ,
	data_przydzialu      date DEFAULT CURRENT_DATE NOT NULL  ,
	CONSTRAINT pk_wiezniowie_cele PRIMARY KEY ( id_wieznia, data_przydzialu ),
	CONSTRAINT fk_wiezniowie_cele_cele FOREIGN KEY ( nr_celi ) REFERENCES "public".cele( nr_celi )   ,
	CONSTRAINT fk_wiezniowie_cele_wiezniowie FOREIGN KEY ( id_wieznia ) REFERENCES "public".wiezniowie( id_wieznia )   
 );

CREATE  TABLE "public".wiezniowie_gangi ( 
	id_wieznia           numeric  NOT NULL  ,
	id_gangu             numeric  NOT NULL  ,
	data_przystapienia   date DEFAULT CURRENT_DATE NOT NULL  ,
	data_odejscia        date    ,
	CONSTRAINT fk_wiezniowie_gangi_gangi FOREIGN KEY ( id_gangu ) REFERENCES "public".gangi( id_gangu )   ,
	CONSTRAINT fk_wiezniowie_gangi_wiezniowie FOREIGN KEY ( id_wieznia ) REFERENCES "public".wiezniowie( id_wieznia )   
 );

CREATE  TABLE "public".wiezniowie_wyroki ( 
	id_wyroku            numeric DEFAULT nextval('wiezniowie_wyroki_id_wyroku_seq'::regclass) NOT NULL  ,
	id_wieznia           numeric  NOT NULL  ,
	data_skazania        date DEFAULT CURRENT_DATE not null  ,
	CONSTRAINT pk_wiezniowie_wyroki PRIMARY KEY ( id_wyroku ),
	CONSTRAINT fk_wiezniowie_wyroki_wiezniowie FOREIGN KEY ( id_wieznia ) REFERENCES "public".wiezniowie( id_wieznia )   
 );

CREATE  TABLE "public".zespoly ( 
	id_zespolu           numeric  NOT NULL  ,
	nazwa                varchar(40)  NOT NULL  ,
	blok                 numeric  ,
	pietro               numeric  ,
	CONSTRAINT pk_zespoly PRIMARY KEY ( id_zespolu ),
	CONSTRAINT fk_zespoly_bloki FOREIGN KEY ( blok ) REFERENCES "public".bloki( id_bloku )   
 );

CREATE  TABLE "public".zmiany ( 
	id_zmiany            numeric  NOT NULL  ,
	dzien_tygodnia       varchar  NOT NULL  ,
	zmiana_start         time  NOT NULL  ,
	zmiana_koniec        time  NOT NULL  ,
	CONSTRAINT pk_zmiany PRIMARY KEY ( id_zmiany )
 );

CREATE  TABLE "public".historia_liderow ( 
	id_gangu             numeric  NOT NULL  ,
	id_wieznia           numeric  NOT NULL  ,
	data_objecia_przywodztwa timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	data_zakonczenia     timestamp    ,
	CONSTRAINT pk_historia_liderow PRIMARY KEY ( id_gangu, id_wieznia, data_objecia_przywodztwa ),
	CONSTRAINT fk_historia_liderow_gangi FOREIGN KEY ( id_gangu ) REFERENCES "public".gangi( id_gangu )   ,
	CONSTRAINT fk_historia_liderow_wiezniowie FOREIGN KEY ( id_wieznia ) REFERENCES "public".wiezniowie( id_wieznia )   
 );

CREATE  TABLE "public".historia_wiezniowie ( 
	id_wieznia           numeric  NOT NULL  ,
	data_rozpoczecia     date DEFAULT CURRENT_DATE NOT NULL  ,
	data_zakonczenia     date    ,
	powod                numeric    ,
	CONSTRAINT pk_historia_wiezniowie PRIMARY KEY ( id_wieznia, data_rozpoczecia ),
	CONSTRAINT fk_historia_wiezniowie2 FOREIGN KEY ( powod ) REFERENCES "public".powod_zakonczenia( id_powodu )   ,
	CONSTRAINT fk_historia_wiezniowie FOREIGN KEY ( id_wieznia ) REFERENCES "public".wiezniowie( id_wieznia )   
 );

CREATE  TABLE "public".historia_wyroku ( 
	id_wyroku            numeric  NOT NULL  ,
	data_orzekniecia     date DEFAULT CURRENT_DATE NOT NULL  ,
	dlugosc_wyroku       interval  NOT NULL  ,
	opis                 varchar(400)    ,
	CONSTRAINT pk_historia_wyroku PRIMARY KEY ( id_wyroku, data_orzekniecia ),
	CONSTRAINT fk_historia_wyroku FOREIGN KEY ( id_wyroku ) REFERENCES "public".wiezniowie_wyroki( id_wyroku )   
 );

CREATE  TABLE "public".pracownicy ( 
	id_pracownika        numeric DEFAULT nextval('pracownicy_id_pracownika_seq'::regclass) NOT NULL  ,
	imie                 varchar(40)  NOT NULL  ,
	nazwisko             varchar(40)  NOT NULL  ,
	pesel                char(11)  NOT NULL  ,
	plec                 char(1)  NOT NULL  ,
	data_urodzenia       date  NOT NULL  ,
	CONSTRAINT pk_pracownicy PRIMARY KEY ( id_pracownika ),
	CONSTRAINT pk_pesel UNIQUE ( pesel )
 );

CREATE  TABLE "public".pracownicy_nieobecnosci ( 
	id_pracownika        numeric  NOT NULL  ,
	data_rozpoczecia     date DEFAULT CURRENT_DATE NOT NULL  ,
	data_zakonczenia     date  NOT NULL  ,
	id_powodu_nieob      numeric  NOT NULL  ,
	CONSTRAINT pk_pracownicy_urlopy PRIMARY KEY ( id_pracownika, data_rozpoczecia, data_zakonczenia ),
	CONSTRAINT fk_pracownicy_nieobecnosci FOREIGN KEY ( id_powodu_nieob ) REFERENCES "public".powody_nieobecnosci( id_powodu_nieob )   ,
	CONSTRAINT fk_pracownicy_urlopy FOREIGN KEY ( id_pracownika ) REFERENCES "public".pracownicy( id_pracownika )   
 );

CREATE  TABLE "public".pracownicy_zespoly ( 
	id_pracownika        numeric  NOT NULL  ,
	id_zespolu           numeric  NOT NULL  ,
	data_rozpoczecia     date DEFAULT CURRENT_DATE NOT NULL  ,
	data_zakonczenia     date    ,
	CONSTRAINT pk_pracownicy_zespoly PRIMARY KEY ( id_pracownika, id_zespolu, data_rozpoczecia ),
	CONSTRAINT fk_pracownicy_zespoly_pracownicy FOREIGN KEY ( id_pracownika ) REFERENCES "public".pracownicy( id_pracownika )   ,
	CONSTRAINT fk_pracownicy_zespoly_zespoly FOREIGN KEY ( id_zespolu ) REFERENCES "public".zespoly( id_zespolu )   
 );

CREATE  TABLE "public".pracownicy_zmiany ( 
	id_pracownika        numeric  NOT NULL  ,
	id_zmiany            numeric  NOT NULL  ,
	CONSTRAINT pk_pracownicy_zmiany PRIMARY KEY ( id_pracownika, id_zmiany ),
	CONSTRAINT fk_pracownicy_zmiany FOREIGN KEY ( id_pracownika ) REFERENCES "public".pracownicy( id_pracownika )   ,
	CONSTRAINT fk_pracownicy_zmiany2 FOREIGN KEY ( id_zmiany ) REFERENCES "public".zmiany( id_zmiany )   
 );

CREATE  TABLE "public".sprawowanie ( 
	typ                  char(1)  NOT NULL  ,
	id_wieznia           numeric  NOT NULL  ,
	data_uzyskania       date DEFAULT CURRENT_DATE NOT NULL  ,
	opis                 varchar(400)    ,
	waga                 numeric DEFAULT 0 NOT NULL  ,
	CONSTRAINT pk_sprawowanie PRIMARY KEY ( id_wieznia, data_uzyskania ),
	CONSTRAINT fk_sprawowanie_wiezniowie FOREIGN KEY ( id_wieznia ) REFERENCES "public".wiezniowie( id_wieznia )   
 );--***

CREATE  TABLE "public".wiezniowie_prace ( 
	id_wieznia           numeric  NOT NULL  ,
	id_pracy             numeric  NOT NULL  ,
	id_zmiany            numeric  NOT NULL  ,
	CONSTRAINT pk_wiezniowie_prace PRIMARY KEY ( id_wieznia, id_pracy, id_zmiany ),
	CONSTRAINT fk_wiezniowie_prace_spol FOREIGN KEY ( id_pracy ) REFERENCES "public".prace_spoleczne( id_pracy )   ,
	CONSTRAINT fk_wiezniowie_prace_wiezniowie FOREIGN KEY ( id_wieznia ) REFERENCES "public".wiezniowie( id_wieznia )   ,
	CONSTRAINT fk_wiezniowie_prace_zmiany FOREIGN KEY ( id_zmiany ) REFERENCES "public".zmiany( id_zmiany )   
 );--***

CREATE  TABLE "public".historia_pracownicy ( 
	id_pracownika        numeric  NOT NULL  ,
	data_rozpoczecia     date DEFAULT CURRENT_DATE NOT NULL  ,
	data_zakonczenia     date    ,
	id_przelozonego      numeric    ,
	id_stanowiska        numeric  NOT NULL  ,
	CONSTRAINT pk_historia_pracownicy PRIMARY KEY ( id_pracownika, data_rozpoczecia ),
	CONSTRAINT fk_historia_pracownicy FOREIGN KEY ( id_pracownika ) REFERENCES "public".pracownicy( id_pracownika ),   
	CONSTRAINT fk_pracownicy_pracownicy FOREIGN KEY ( id_przelozonego ) REFERENCES "public".pracownicy( id_pracownika ) ON DELETE SET NULL  ,
	CONSTRAINT fk_pracownicy_stanowiska FOREIGN KEY ( id_stanowiska ) REFERENCES "public".stanowiska( id_stanowiska )   
 );

ALTER TABLE "public".powody_nieobecnosci ADD CONSTRAINT cns_powody_nieobecnosci CHECK ( (platny >= (0)::numeric) );

ALTER TABLE "public".powody_nieobecnosci ADD CONSTRAINT placa_check CHECK ( (platny <= 1.00) );

ALTER TABLE "public".relacje_gangi ADD CONSTRAINT gangi_id_equal CHECK ( (id_gangu_1 <> id_gangu_2) );

ALTER TABLE "public".relacje_gangi ADD CONSTRAINT relation_type_check CHECK ( (typ_relacji = ANY (ARRAY['P'::bpchar, 'N'::bpchar])) );

ALTER TABLE "public".wiezniowie ADD CONSTRAINT age_check CHECK ( (date_part('year'::text, age((CURRENT_DATE)::timestamp with time zone, (data_urodzenia)::timestamp with time zone)) >= (17)::double precision) );

ALTER TABLE "public".wiezniowie ADD CONSTRAINT plec_check CHECK ( (plec = ANY (ARRAY['M'::bpchar, 'K'::bpchar])) );

ALTER TABLE "public".bloki ADD CONSTRAINT plec_check CHECK ( (plec = ANY (ARRAY['M'::bpchar, 'K'::bpchar])) );

ALTER TABLE "public".powody_nieobecnosci ADD CONSTRAINT rodzaj_check CHECK ( (rodzaj = ANY (ARRAY['U'::bpchar, 'Z'::bpchar])) );

ALTER TABLE "public".wiezniowie ADD CONSTRAINT check_data CHECK ( (data_urodzenia < CURRENT_DATE) );

ALTER TABLE "public".zmiany ADD CONSTRAINT dzien_check CHECK ( ((dzien_tygodnia)::text = ANY ((ARRAY['Monday'::character varying, 'Tuesday'::character varying, 'Wednesday'::character varying, 'Thursday'::character varying, 'Friday'::character varying, 'Saturday'::character varying, 'Sunday'::character varying])::text[])) );

ALTER TABLE "public".pracownicy ADD CONSTRAINT date_check CHECK ( (data_urodzenia < CURRENT_DATE) );

ALTER TABLE "public".pracownicy ADD CONSTRAINT plec_check CHECK ( (plec = ANY (ARRAY['M'::bpchar, 'K'::bpchar])) );

ALTER TABLE "public".pracownicy_nieobecnosci ADD CONSTRAINT cns_pracownicy_urlopy CHECK ( (data_rozpoczecia >= CURRENT_DATE) );

ALTER TABLE "public".pracownicy_nieobecnosci ADD CONSTRAINT begin_end_check CHECK ( (data_rozpoczecia < data_zakonczenia) );

ALTER TABLE "public".sprawowanie ADD CONSTRAINT cns_sprawowanie CHECK ( (typ = ANY (ARRAY['D'::bpchar, 'N'::bpchar])) );

ALTER TABLE "public".powod_zakonczenia ADD CONSTRAINT fk_powod_zakonczenia FOREIGN KEY ( rodzaj ) REFERENCES "public".powody_zakonczenia_rodzaje( id_rodzaju );


CREATE INDEX idx_wiezniowie_gangi ON "public".wiezniowie_gangi  ( id_wieznia, id_gangu, data_przystapienia );


--functions

-- (copy&paste template)
/*
create or replace function nazwa() returns typ as $$

begin

end;
$$ language plpgsql;
*/
-- end of template


--- plec (0 dla kobit 1 dla chlopow)
create or replace function pesel_check(pesel text,data_urodzenia date, plec int) returns boolean as
$$
declare
      s numeric;
      arr numeric[4];
      i numeric;
      w char;
	  mon int;
begin
	--raise exception '%',pesel;
      s = 0;
      arr[0] = 1;
      arr[1] = 3;
      arr[2] = 7;
      arr[3] = 9;
      if(pesel is null or length(pesel) != 11) then
	  		--raise exception 'wiiiuuuuuu';
              return false;
      end if;
      i = 1;
      for i in 1..10 loop
              s =s + (arr[(i-1)%4] * (ASCII(substring(pesel,i,1))-48));
      end loop;
      s = (10 - s%10)%10;
      if(ASCII(substring(pesel,11,1))-48 != s) then
	  			--raise exception 'sayy what';
              return false;
      end if;
	  -- sprawdzenie roku
	  mon = cast(substring(pesel,3,2) as int);
	  --raise exception '%',substring(pesel,1,2);
	  if(substring(pesel,1,2) != substring(cast(extract(year from data_urodzenia) as text),3,2)) then
	  	--raise exception 'wowow';
	  	return false;
	  elseif(cast(CASE
                WHEN 80 < mon THEN mon-80
                WHEN 60 < mon THEN mon-60
                WHEN 40 < mon THEN mon-40
                WHEN 20 < mon THEN mon-20
                ELSE mon end as int) != cast(extract(month from data_urodzenia) as int)) then
			--raise exception 'pwowow';
		return false;
	   elseif(cast(substring(pesel,5,2) as int) != cast(extract(day from data_urodzenia) as int)) then
	   --	raise exception 'woieng';
	   		return false;
		elseif((((cast(pesel as bigint))/10)%2) != plec) then
			--raise exception '%',round(cast(pesel as numeric(11,0))/10,0)%2;
			return false;
		end if;
		--raise exception 'cuit';
		return true;
      
end;
$$ language plpgsql;


----
create or replace function ile_wiezniow_jest_w_celach() returns numeric as $$

begin
	return (select count(*) from wiezniowie_cele where data_wyprowadzki is null);
end;
$$ language plpgsql;

----
create or replace function pojemnosc_cel() returns numeric as $$

begin
	return (select sum(limit_os) from cele);
end;
$$ language plpgsql;

----
create or replace function procent_zapelnienia_wiezienia() returns numeric as $$

begin
	return round((ile_wiezniow_jest_w_celach()/pojemnosc_cel())*100,2);
end;
$$ language plpgsql;

----
create or replace function ile_wolnych_miejsc() returns numeric as $$

begin
	return (select pojemnosc_cel() - ile_wiezniow_jest_w_celach());
end;
$$ language plpgsql;


----
create or replace function znajdz_id_wolnej_celi(pl char(1)) returns numeric as $$
declare
	i record;
begin
	for i in (select * from cele join bloki on blok = id_bloku where pl=plec) loop
		if((select count(*) from wiezniowie_cele as "wc" where wc.nr_celi = i.nr_celi and wc.data_wyprowadzki is null) < i.limit_os) then
			return i.nr_celi;
		end if;
	end loop;
	return null;
end;
$$ language plpgsql;

----
create or replace function ile_pracownikow_dzisiaj_obecnych() returns numeric as $$
declare
	i record;
	ile numeric;
begin
	ile = 0;
	for i in (select * from pracownicy join historia_pracownicy using(id_pracownika) where data_zakonczenia is null) loop
		if((select count(*) from pracownicy_nieobecnosci as "pn" where pn.data_rozpoczecia <= current_date and pn.data_zakonczenia >= current_date and 
		   pn.id_pracownika = i.id_pracownika) = 0) then
			ile = ile + 1;
		end if;
	end loop;
	return ile;
end;
$$ language plpgsql;


----
create or replace function ile_pracownikow_nieobecnych() returns numeric as $$

begin
	return (select count(*) from pracownicy join historia_pracownicy using(id_pracownika) where data_zakonczenia is null) - ile_pracownikow_dzisiaj_obecnych();
end;
$$ language plpgsql;


----

create or replace function ilosc_dobrych_sprawowan_od(poczatek date) returns numeric as $$

begin
	return (select count(*) from sprawowanie where data_uzyskania >= poczatek and typ = 'D');
end;
$$ language plpgsql;


----


create or replace function ilosc_negatywnych_sprawowan_od(poczatek date) returns numeric as $$

begin
	return (select count(*) from sprawowanie where data_uzyskania >= poczatek and typ = 'N');
end;
$$ language plpgsql;

----

create or replace function kiedy_wiezien_wychodzi(id_wieznia_in numeric) returns timestamp as $$
declare
	i record;
	res timestamp;
begin
	res = null;
	for i in (select * from wiezniowie_wyroki join historia_wyroku using(id_wyroku) where id_wieznia = id_wieznia_in order by data_skazania) loop
		if(res is null) then 
			res = i.data_skazania::timestamp + i.dlugosc_wyroku;
		elseif (res + i.dlugosc_wyroku < i.data_skazania::timestamp + i.dlugosc_wyroku) then
			res = i.data_skazania::timestamp + i.dlugosc_wyroku;
		else
			res = res + i.dlugosc_wyroku;
		end if;
	end loop;
	return res;
end;
$$ language plpgsql;


----
create or replace function czy_wiezien_ma_jeszcze_wyrok(id_w_in numeric) returns boolean as $$

begin
	return (current_timestamp <= kiedy_wiezien_wychodzi(id_w_in)) and ((select count(*) from historia_wiezniowie where id_wieznia = id_w_in and data_zakonczenia is not null)) != 0;
end;
$$ language plpgsql;

----


create or replace function ile_wiezniow_ma_zakonczony_wyrok() returns numeric as $$
declare
	i record;
	res numeric;
begin
	res = 0;
	for i in (select * from wiezniowie) loop
		if(!czy_wiezien_ma_jeszcze_wyrok(i.id_wieznia)) then
			res = res + 1;
		end if;
	end loop;
	return res;
end;
$$ language plpgsql;

---- 


create or replace function ile_wiezniow_nalezy_do_gangu(nr_gangu numeric) returns numeric as $$

begin
	return (select count(*) from wiezniowie_gangi where data_odejscia is null and id_gangu = nr_gangu and czy_wiezien_ma_jeszcze_wyrok(id_wieznia));
end;
$$ language plpgsql;

----

create or replace function ile_wiezniow_dzisiaj_wychodzi() returns numeric as $$
declare
	i record;
	res numeric;
begin
	res = 0;
	for i in (select * from wiezniowie) loop
		if(cast(kiedy_wiezien_wychodzi(i.id_wieznia) as date) = current_date) then
			res = res + 1;
		end if;
	end loop;
	return res;
end;
$$ language plpgsql;

----

create or replace function czy_pracownik_na_urlopie(id_prac numeric) returns boolean as $$

begin
	if((select count(*) from historia_pracownicy where id_pracownika = id_prac and data_zakonczenia is null) != 0 and 
	   (select count(*) from pracownicy_nieobecnosci where id_pracownika = id_prac and data_zakonczenia >= current_date and data_rozpoczecia <= current_date) != 0 ) then
	   return true;
	 end if;
	 return false;
end;
$$ language plpgsql;

----

create or replace function bilans_sprawowan(id_w numeric) returns table(
	ile_pozytywnych bigint,
	ile_negatywnych bigint,
	sumaryczna_waga numeric
) as $$

begin
	return query (select (select count(*) from sprawowanie where id_wieznia = id_w and typ = 'D' ),
				  (select count(*) from sprawowanie where id_wieznia = id_w and typ = 'N'),
				  (select 
				   		case when sum(waga) is null then 0 else sum(waga) end
				   from sprawowanie where id_wieznia = id_w and typ = 'D') - 
				  (select 
				   		case when sum(waga) is null then 0 else sum(waga) end
				   	from sprawowanie where id_wieznia = id_w and typ = 'N'));
end;
$$ language plpgsql;

----
--drop function wiezien_info(numeric);
create or replace function wiezien_info(id_w numeric) returns table (
	id_wieznia numeric,
	imie  varchar(40),
	nazwisko  varchar(40),
	pesel char(11) ,
	plec  char(1) ,
	data_urodzenia  date,
	data_wyjscia date,
	nr_celi numeric,
	ilosc_dobrych_sprawowan bigint,
	ilosc_zlych_sprawowan bigint,
	id_gangu numeric,
	nazwa_gangu varchar(100) ,
	liczba_prac bigint
) as $$
begin
	return query (select wi.id_wieznia,wi.imie,wi.nazwisko,wi.pesel,wi.plec,wi.data_urodzenia,cast(kiedy_wiezien_wychodzi(id_w) as date),
				  (select wc.nr_celi from wiezniowie_cele as "wc" where wc.id_wieznia = id_w),
				  (select count(*) from sprawowanie as "s1" where s1.id_wieznia = id_w and s1.typ = 'D' ),
				  (select count(*) from sprawowanie as "s2" where s2.id_wieznia = id_w and s2.typ = 'N' ),
				  (select wgid.id_gangu from wiezniowie_gangi as "wgid" where wgid.id_wieznia = id_w),
				  (select 
				  	case when ((select wg.id_gangu from wiezniowie_gangi as "wg" where wg.id_wieznia = id_w)) is not null then
				   		(select nazwa from wiezniowie_gangi as "wg" join gangi using(id_gangu) where wg.id_wieznia = id_w)
				   	else
				   		'Brak'
				   	end
				  ),
				  (select count(*) from wiezniowie_prace as "wp" where wp.id_wieznia = id_w) from wiezniowie as "wi"
				 where wi.id_wieznia = id_w);
				  
end;
$$ language plpgsql;

----

create or replace function his_of_wiezien(id_w numeric) returns table(
	"data" date,
	opis text
) as $$
begin
	return query ( (
		((select data_uzyskania,'Przyznano sprawowanie' from sprawowanie where id_wieznia = id_w order by 1)
		union
		(select wg.data_przystapienia,'Dolaczono do gangu' from wiezniowie_gangi as "wg" where id_wieznia = id_w order by 1)
		 )
		union
		(select wg2.data_odejscia,'Odejscie z gangu' from wiezniowie_gangi as "wg2" where id_wieznia = id_w and wg2.data_odejscia is not null order by 1)
		union
		(select hw1.data_rozpoczecia,'Wejscie do wiezienia' from historia_wiezniowie as "hw1" where id_wieznia = id_w order by 1)
		union
		(select hw2.data_zakonczenia,'Opuszczenie wiezienia' from historia_wiezniowie as "hw2" where id_wieznia = id_w and hw2.data_zakonczenia is not null order by 1)
	) order by 1);
end;
$$ language plpgsql;

----

create or replace function range_wiezien_info_odejscia(st date,ed date) returns int as $$
declare 
	res1 int;
	res2 int;
	i record;
begin
	res1 = 0;
	res2 = 0;
	for i in (select * from historia_wiezniowie) loop
		if(st <= i.data_rozpoczecia and ed >= i.data_rozpoczecia) then
			res1 = res1 + 1;
		end if;
		if(i.data_zakonczenia is not null and st<=i.data_zakonczenia and ed >= i.data_zakonczenia) then
			res2 = res2 + 1;
		end if;
	end loop;
	return res2;
end;

$$ language plpgsql;

----

create or replace function range_wiezien_info_przyjscia(st date,ed date) returns int as $$
declare 
	res1 int;
	res2 int;
	i record;
begin
	res1 = 0;
	res2 = 0;
	for i in (select * from historia_wiezniowie) loop
		if(st <= i.data_rozpoczecia and ed >= i.data_rozpoczecia) then
			res1 = res1 + 1;
		end if;
		if(i.data_zakonczenia is not null and st<=i.data_zakonczenia and ed >= i.data_zakonczenia) then
			res2 = res2 + 1;
		end if;
	end loop;
	return res1;
end;

$$ language plpgsql;

----
create or replace function his_of_pracownik(id_p numeric) returns table(
	"data" date,
	opis text
) as $$
begin
	return query ( (
		((select data_rozpoczecia,'Rozpoczeto urlop' from pracownicy_nieobecnosci where id_pracownika = id_p order by 1)
		union
		(select data_zakonczenia,'Koniec urlopu' from pracownicy_nieobecnosci where id_pracownika = id_p and data_zakonczenia is not null order by 1)
		 ) order by 1));
end;
$$ language plpgsql;

----

create or replace function wywal_wieznia(id_w numeric, data_wyjscia date ) returns void as $$
begin
    update wiezniowie_cele set data_wyprowadzki = data_wyjscia where id_wieznia = id_w and data_wyprowadzki is null;
    update historia_wiezniowie set data_zakonczenia = data_wyjscia where id_wieznia = id_W and data_zakonczenia is null;
    update wiezniowie_gangi set data_odejscia = data_wyjscia where id_wieznia = id_W and data_odejscia is null;
end;
$$ language plpgsql;

----

create or replace function dodaj_pracownika(	imie                 varchar(40) ,
	nazwisko  varchar(40),
	pesel  char(11),
	plec   char(1),
	data_urodzenia date, data_rozpoczecia date, id_przelozonego numeric, id_stanowiska numeric) returns boolean as $$
declare 
	temp_id numeric;
begin	
	insert into pracownicy(imie,nazwisko,pesel,plec,data_urodzenia) values (imie,nazwisko,pesel,plec,data_urodzenia) returning id_pracownika into temp_id;
	insert into historia_pracownicy(id_pracownika,data_rozpoczecia,data_zakonczenia,id_przelozonego,id_stanowiska) values (temp_id,data_rozpoczecia,null,id_przelozonego,id_stanowiska);
	return true;
end;
	$$ language plpgsql;

----

create or replace function usun_z_celi(id_w numeric, kiedy date) returns boolean as $$
begin
	update wiezniowie_cele set data_wyprowadzki = kiedy where id_wieznia = id_w and data_wyprowadzki is null;
	return true;
end;
$$ language plpgsql;

-----

----
create or replace function stanowisko_przelozony_prac(id_p numeric) returns table(
    id_stanowiska numeric,
     id_przelozonego numeric
) as $$
begin
    return query (select historia_pracownicy.id_stanowiska,historia_pracownicy.id_przelozonego from historia_pracownicy where id_pracownika = id_p order by data_rozpoczecia DESC limit 1);
end;
$$ language plpgsql;
----


create or replace function czy_pracownik_obecnie_na_zmianie(id_p numeric) returns boolean as $$
declare 
	i record;
	curr_time timestamp;
begin
	if(czy_pracownik_na_urlopie(id_p)) then
		return false;
	end if;
	for i in (select * from zmiany join pracownicy_zmiany using(id_zmiany) where id_pracownika = id_p and to_char(current_date,'Day') like concat(dzien_tygodnia,'%')) loop
		--raise exception '%', cast(current_timestamp as timestamp);
		if(cast(concat(current_date,' ',i.zmiana_start) as timestamp) <= cast(current_timestamp as timestamp) and cast(concat(current_date,' ',i.zmiana_koniec) as timestamp) >= cast(current_timestamp as timestamp)) then
			return true;
		end if;
	end loop;
	return false;
end;
$$ language plpgsql;


----

create or replace function ile_wiezniow_nalezy_do_gangow() returns numeric as $$

begin
    return (select count(*) from wiezniowie_gangi where data_odejscia is null and czy_wiezien_ma_jeszcze_wyrok(id_wieznia));
end;
$$ language plpgsql;

----

create or replace function ile_wiezniow_nie_nalezy_do_gangow() returns numeric as $$

begin
    return (select * from ile_wiezniow_jest_w_celach())-(select count(*) from wiezniowie_gangi where data_odejscia is null and czy_wiezien_ma_jeszcze_wyrok(id_wieznia));
end;
$$ language plpgsql;


----

create or replace function last_years() returns table (
	ile_przyszlo int,
	ile_odeszlo int,
	rok text
) as $$
begin
	return query (select range_wiezien_info_przyjscia(cast(concat(substring(cast(cast(gen as date) as text),1,4),'-01-01')as date),cast(concat(substring(cast(cast(gen as date) as text),1,4),'-12-31')as date)),
				   range_wiezien_info_odejscia(cast(concat(substring(cast(cast(gen as date) as text),1,4),'-01-01')as date),cast(concat(substring(cast(cast(gen as date) as text),1,4),'-12-31')as date)),
											substring(cast(cast(gen as date) as text),1,4) from generate_series(current_timestamp,current_timestamp - interval '4 years',-interval '1 year') as "gen");
end;
$$ language plpgsql;

----

create or replace function czy_cela_wolna(id_celi numeric) returns boolean as $$
begin
    if((select count(*) from wiezniowie_cele as "wc" where wc.nr_celi = id_celi and wc.data_wyprowadzki is null) < (select limit_os from cele where nr_celi = id_celi)) then
            return true;
    end if;
    return false;
end;
$$ language plpgsql;

----

create or replace function zmien_cele(id_w numeric, id_celi numeric) returns void as $$
begin
	if(not czy_wiezien_ma_jeszcze_wyrok(id_w)) then
		raise exception 'Wiezien nie jest w wiezieniu';
	end if;
    if(not czy_cela_wolna(id_celi)) then
        raise exception 'Wybrana cela nie jest wolna';
    end if;
	if((select count(*) from bloki join cele on blok = id_bloku where nr_celi = id_celi and plec = plec_wieznia(id_w) ) = 0) then
		raise exception 'Wybrana cela nie jest dostepna dla wieznia z powodu na plec';
	end if;
    update wiezniowie_cele set data_wyprowadzki = current_date where id_wieznia = id_w and data_wyprowadzki is null;
    insert into wiezniowie_cele(id_wieznia, nr_celi, data_przydzialu) values (id_w, id_celi,current_date);

end;
$$ language plpgsql;

----


create or replace function change_gang(id_w numeric, id_g numeric ) returns void as $$
declare
    id_curr_gang numeric;
begin
    if(wiezien_aktywny(id_w)) then
        raise exception 'Wiezien nie jest obecnie w wiezieniu';
    end if;
    id_curr_gang = (select id_gangu from wiezniowie_gangi where id_wieznia = id_w and data_odejscia is null limit 1);
    if(id_curr_gang is not null) then
        update wiezniowie_gangi set data_odejscia = current_date where id_wieznia = id_w and data_odejscia is null;
    end if;
    insert into wiezniowie_gangi values (id_w,id_g,current_date,null);
end;
$$ language plpgsql;

----

create or replace function dodaj_wyrok_do_wieznia(id_w numeric,data_skaz date,dlugosc_wyr interval,opi varchar) returns void as $$
declare
	id_wyr numeric;
begin
	insert into wiezniowie_wyroki(id_wieznia,data_skazania) values (id_w,data_skaz) returning id_wyroku into id_wyr;
	insert into historia_wyroku values (id_wyr,data_skaz,dlugosc_wyr,opi);
end;
$$ language plpgsql;


----

create or replace function zmien_stanowisko_prac(id_p numeric, id_s numeric) returns void as $$
declare
	id_przel numeric;
begin
	id_przel = (select id_przelozonego from historia_pracownicy where id_pracownika = id_p and data_zakonczenia is null limit 1);
	update historia_pracownicy set data_zakonczenia = current_date where id_pracownika = id_p and data_zakonczenia is null;
	insert into historia_pracownicy values (id_p,current_date,null,id_przel,id_s);
end;
$$ language plpgsql;

----

create or replace function liderzy_gangu(id_g numeric) returns 
table( inf text ) as $$ 
begin
	return query (select concat(wi.id_wieznia, ' ', imie, ' ', nazwisko) from wiezniowie as "wi" join historia_liderow using(id_wieznia) where 
				 id_gangu = id_g and data_zakonczenia is null);
end;
$$ language plpgsql;

----

create or replace function aktywny_prac(id_p numeric) returns boolean as $$
begin
	return ((select count(*) from historia_pracownicy where id_pracownika = id_p and data_zakonczenia is null) != 0);
end;
$$ language plpgsql;

----

create or replace function zmien_stanowisko_prac_oraz_przel(id_p numeric, id_s numeric, id_przel numeric) returns void as $$
begin
	--id_przel = (select id_przelozonego from historia_pracownicy where id_pracownika = id_p and data_zakonczenia is null limit 1);
	update historia_pracownicy set data_zakonczenia = current_date where id_pracownika = id_p and data_zakonczenia is null;
	insert into historia_pracownicy values (id_p,current_date,null,id_przel,id_s);
end;
$$ language plpgsql;


---

create or replace function wiezien_aktywny(id_w numeric)  returns boolean as $$
begin
    if((select id_wieznia from historia_wiezniowie where id_w = id_wieznia and data_zakonczenia is null) is not null) then return true;
    end if;
    return false; 
end;
$$ language plpgsql;

----

create or replace function koniec_lidera(id_w numeric, id_g numeric) returns void as $$
begin
	update historia_liderow set data_zakonczenia = current_date where id_wieznia = id_w and id_gangu = id_g and data_zakonczenia is null;
end;
$$ language plpgsql;

----

create or replace function plec_wieznia(id_w numeric) returns char(1) as $$
begin
	return (select plec from wiezniowie where id_w = id_wieznia limit 1);
end;
$$ language plpgsql;

----

create or replace function wiezien_aktywny2(id_w numeric, szukana_data date)  returns boolean as $$
begin
    if((select id_w from historia_wiezniowie where id_w = id_wieznia and (szukana_data between symmetric data_rozpoczecia and coalesce(data_zakonczenia, current_date))) is not null) then return true;
    end if;
    return false; 
end;
$$ language plpgsql;


----

--BASIC RULES ON DELETE
create or replace function del_except() returns void as $$
begin
	raise exception 'Nie mozna usunac elementu z tej tabeli';
end;
$$ language plpgsql;
create or replace function update_except() returns void as $$
begin
	raise exception 'Nie mozna modyfikowac elementow z tej tabeli';
end;
$$ language plpgsql;

create rule wiezniowie_non_delete_rule as on delete to wiezniowie do instead (select del_except());

create rule historia_wiezniowie_non_delete_rule as on delete to historia_wiezniowie do instead (select del_except());

create rule prace_spoleczne_non_delete_rule as on delete to prace_spoleczne do instead (select del_except());

create rule sprawowanie_non_delete_rule as on delete to sprawowanie do instead (select del_except());

create rule powod_zakonczenia_non_delete_rule as on delete to powod_zakonczenia do instead (select del_except());

create rule pracownicy_non_delete_rule as on delete to pracownicy do instead (select del_except());

create rule historia_prcownicy_non_delete_rule as on delete to historia_pracownicy do instead (select del_except());

create rule historia_liderow_non_delete_rule as on delete to historia_liderow do instead (select del_except());

create rule wiezniowie_gangi_non_delete_rule as on delete to wiezniowie_gangi do instead (select del_except());

create rule gangi_non_delete_rule as on delete to gangi do instead (select del_except());

create rule historia_wyroku_non_delete_rule as on delete to historia_wyroku do instead (select del_except());

create rule wiezniowie_wyroki_non_delete_rule as on delete to wiezniowie_wyroki do instead (select del_except());

create rule wiezniowie_cele_non_delete_rule as on delete to wiezniowie_cele do instead (select del_except());

create rule pracownicy_zespoly_non_delete_rule as on delete to pracownicy_zespoly do instead (select del_except());

create rule pracownicy_nieobecnosci_non_delete_rule as on delete to pracownicy_nieobecnosci do instead (select del_except());

create rule cele_non_delete_rule as on delete to cele do instead (select del_except());

create rule bloki_non_delete_rule as on delete to bloki do instead (select del_except());

create rule zespoly_non_delete_rule as on delete to zespoly do instead (select del_except());

create rule zmiany_non_delete_rule as on delete to zmiany do instead (select del_except());


---- CELE TRIGGER
-- nie zmieniamy id, czy pietro celi miesci sie w pietrze bloku, czy ilosc wiezniow obecnie przypisanych do celi jest nie wieksza niz jej pojemnosc
create or replace function cele_function_trigger() returns trigger as $$
begin

	if(old is not null and old.nr_celi != new.nr_celi) then
		raise exception 'Nie mozna zmienic numeru celi';
		return old;
	elseif((select liczba_pieter from bloki where id_bloku = new.blok) <= new.pietro) then
		raise exception 'Wprowadziles niepoprawne pietro';
		return old;
	elseif((select count(*) from wiezniowie_cele where data_wyprowadzki is null) > new.limit_os) then
		raise exception 'Wprowadziles niepoprawny limit osob';
		return old;
	end if;
	return new;
		
end;
$$ language plpgsql;

create trigger cele_trigger before insert or update on cele for each row execute procedure cele_function_trigger();

-- nie zmieniamy id bloku, sprawdzmy czy po zmianie ilosci pieter cele oraz zespoly w nich maja sens istnienia
create or replace function bloki_function_trigger() returns trigger as $$
begin

	if(old is not null and (old.id_bloku != new.id_bloku or old.plec != new.plec)) then
		raise exception 'Nie mozna modyfikowac id_bloku';
		return old;
	elseif((select max(pietro) from cele where blok = new.id_bloku) >= new.liczba_pieter) then
		raise exception 'Wprowadziles niepoprawna liczbe pieter';
		return old;
	elseif((select max(pietro) from zespoly where blok = new.id_bloku) >= new.liczba_pieter) then
		raise exception 'Wprowadziles niepoprawna liczbe pieter';
		return old;
	end if;
	return new;

end;
$$ language plpgsql;

create trigger bloki_trigger before insert or update on bloki for each row execute procedure bloki_function_trigger();

-- id zespolu sie nie zmienia oraz pietro lezy w bloku
create or replace function zespoly_function_trigger() returns trigger as $$
begin 
	if(old is not null and old.id_zespolu != new.id_zespolu) then
		raise exception 'Nie mozna modyfikowac id zespolu';
		return old;
	elseif((select liczba_pieter from bloki where id_bloku = new.blok) <= new.pietro) then
		raise exception 'Wprowadziles niepoprawny numer pietra';
		return old;
	end if;
	return new;
end;
$$ language plpgsql;


create trigger zespoly_trigger before insert or update on zespoly for each row execute procedure zespoly_function_trigger();


-- jedyna mozliwa modyfikacja to data zakonczenia o ile nie zostala nadana + data zakonczenia > data rozpoczecia
create or replace function pracownicy_zespoly_function_trigger() returns trigger as $$
begin
	if(old is not null) then
		if(old.data_zakonczenia is not null) then
			raise exception 'Nie mozna modyfikowac wybranego elementu';
			return old;
		elseif(old.id_pracownika != new.id_pracownika or old.id_zespolu != new.id_zespolu or old.data_rozpoczecia != new.data_rozpoczecia) then
			raise exception 'Nie mozna modyfikowac wybranego elementu';
			return old;
		elseif(new.data_rozpoczecia >= new.data_zakonczenia) then
			raise exception 'Data zakonczenia jest niezgodna z data rozpoczecia';
			return old;
		end if;
		return new;
	elseif(new.data_zakonczenia is not null and new.data_zakonczenia <= new.data_rozpoczecia) then
		raise exception 'Data zakonczenia jest niezgodna z data rozpoczecia';
		return old;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger pracownicy_zespoly_trigger before insert or update on pracownicy_zespoly for each row execute procedure pracownicy_zespoly_function_trigger();

-- nie mozna zmienic id_stanowiska
create or replace function stanowiska_function_trigger() returns trigger as $$
begin
	if(old is not null and old.id_stanowiska != new.id_stanowiska) then
		raise exception 'Nie mozna modyfikowac id stanowiska';
		return old;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger stanowiska_trigger before insert or update on stanowiska for each row execute procedure stanowiska_function_trigger();

--- nie mozna wprowadzic zadnych zmian oraz data zakonczenia > daty rozpoczecia
create rule non_update_pracownicy_nieobecosci as on update to pracownicy_nieobecnosci do instead (select update_except());

create or replace function pracownicy_nieobecnosci_function_trigger() returns trigger as $$
begin
	if(new.data_rozpoczecia >= new.data_zakonczenia) then
		raise exception 'Data zakonczenia nie jest zgodna z data rozpoczecia';
		return null;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger pracownicy_nieobecnosci_trigger before insert on pracownicy_nieobecnosci for each row execute procedure pracownicy_nieobecnosci_function_trigger();

--- nie mozna zmienic id, rodzaju oraz platnosci
create or replace function powody_nieobecnosci_function_trigger() returns trigger as $$
begin
	if(old.id_powodu_nieob != new.id_powodu_nieob or old.rodzaj != new.rodzaj or old.platny != new.platny) then
		raise exception 'Nie mozna modyfikowac wybranego elementu';
		return old;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger powody_nieobecnosci_trigger before update on powody_nieobecnosci for each row execute procedure powody_nieobecnosci_function_trigger();

-- nie mozna modyfikowac id, data rozpoczecia oraz daty zakonczenia jezeli zostala nadana
create or replace function historia_pracownicy_function_trigger() returns trigger as $$
begin
	if(old is null) then
		if(select count(*) from historia_pracownicy as "hp" where hp.id_pracownika = new.id_pracownika and hp.data_zakonczenia is null) then
			update historia_pracownicy set data_zakonczenia = current_date where id_pracownika = new.id_pracownika and data_zakonczenia is null;
		end if;
	elseif(old.id_pracownika != new.id_pracownika or old.data_rozpoczecia != new.data_rozpoczecia or old.data_zakonczenia is not null
		  	or old.id_stanowiska != new.id_stanowiska or old.id_przelozonego != new.id_przelozonego) then
		raise exception 'Nie mozna modyfikowac wybranego elementu';
		return old;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger historia_pracownicy_trigger before insert or update on historia_pracownicy for each row execute procedure historia_pracownicy_function_trigger();

-- brak modyfikacji na zmianach 

create rule non_update_zmiany_rule as on update to zmiany do instead (select update_except());

-- zakaz zmiany id, peselu, daty urodzenia, pesel to 11 cyfr
create or replace function pracownicy_function_trigger() returns trigger as $$
declare 
	plec int;
begin
	if(new.plec = 'M') then
		plec = 1;
	else
		plec = 0;
	end if;
	if(old is not null) then
		if(new.id_pracownika != old.id_pracownika or old.pesel != new.pesel or old.data_urodzenia != new.data_urodzenia) then
			raise exception 'Nie mozna wykonac owych modyfikacji';
			return old;
		end if;
	elseif(pesel_check(cast(new.pesel as text),new.data_urodzenia,plec) = false) then
		raise exception 'Wprowadzno bledny pesel';
		return old;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger pracownicy_trigger before insert or update on pracownicy for each row execute procedure pracownicy_function_trigger();

-- id powodu jest niezmienne 
create or replace function powod_zakonczenia_function_trigger() returns trigger as $$
begin
	if(old is null) then
		insert into historia_pracownicy(id_pracownika,data_rozpoczecia,data_zakonczenia,id_przelozonego,id_stanowiska ) values 
			(new.id_pracownika,current_date,null,null,null);
	elseif(old is not null and new.id_powodu != old.id_powodu) then
		raise exception 'Nie mozna zmienic id powodu';
		return old;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger powod_zakonczenia_trigger before update on powod_zakonczenia for each row execute procedure powod_zakonczenia_function_trigger();

-- id pracy jest niezmienne, sprawdzenie czy sensowna jest zmina liczby osob
create or replace function prace_spoleczne_function_trigger() returns trigger as $$
begin
	if(old is not null) then
		if(new.id_pracy != old.id_pracy) then
			raise exception 'Nie mozna modyfikowac id pracy';
			return old;
		elseif(new.max_liczba_os < (select count(*) from wiezniowie_prace as "wp" where wp.id_pracy = new.id_pracy)) then
			raise exception 'Wprowadziles zla maksymalna liczbe osob';
			return old;
		end if;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger prace_spoleczne_trigger before update on prace_spoleczne for each row execute procedure prace_spoleczne_function_trigger();

-- zakaz modyfikacji tabeli wiezniowie prace 
create rule non_update_wiezniowie_prace_rule as on update to wiezniowie_prace do instead (select update_except());

-- zakaz zmiany id oraz daty_rozpoczecia, po wpisaniu daty_zakonczenia brak mozliwosci modyfikacji
create or replace function historia_wiezniowie_function_trigger() returns trigger as $$
begin
	if(old.data_zakonczenia is not null) then
		raise exception 'Nie mozna modyfikowac elementu';
		return old;
	elseif(new.id_wieznia != old.id_wieznia or new.data_rozpoczecia != old.data_rozpoczecia) then
		raise exception 'Nie mozna modyfikowac elementu';
		return old;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger historia_wizeniowie_trigger before update on historia_wiezniowie for each row execute procedure historia_wiezniowie_function_trigger();

-- zakaz mofyfikacji na sprawowaniu
create rule non_update_sprawowanie_rule as on update to sprawowanie do instead (select update_except());


-- zakaz zmiany id, peselu, daty urodzenia, pesel to 11 cyfr
create or replace function wiezniowie_function_trigger() returns trigger as $$
declare 
	plec int;
begin
	if(new.plec = 'M') then
		plec = 1;
	else
		plec = 0;
	end if;
	if(old is not null) then
		if(new.id_wieznia != old.id_wieznia or old.pesel != new.pesel or old.data_urodzenia != new.data_urodzenia or old.plec != new.plec) then
			raise exception 'Nie mozna wykonac owych modyfikacji';
			return old;
		end if;
	elseif(pesel_check(cast(new.pesel as text),new.data_urodzenia,plec) = false) then
		raise exception 'Wprowadzno bledny pesel';
		return old;
	end if;

	return new;
end;
$$ language plpgsql;

create trigger wiezniowie_trigger before insert or update on wiezniowie for each row execute procedure wiezniowie_function_trigger();

-- relacje nie moga sie powtarzac oraz nie mozna modyfikowac gangow 
create or replace function relacje_gangi_function_trigger() returns trigger as $$
begin
	if(old is not null)	then
		if(new.id_gangu_1!= old.id_gangu_1 or new.id_gangu_2 != old.id_gangu_2) then
			raise exception 'Nie mozna modyfikowac gangow w relacji';
			return old;
		end if;
	elseif(((select count(*) from relacje_gangi as "rg" where rg.id_gangu_1 = new.id_gangu_1 and rg.id_gangu_2 = new.id_gangu_2) != 0) or 
		   ((select count(*) from relacje_gangi as "rg" where rg.id_gangu_1 = new.id_gangu_2 and rg.id_gangu_2 = new.id_gangu_1) != 0)) then
		raise exception 'Istnieje relacja dla podanych gangow';
		return old;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger relacje_gangi_trigger before insert or update on relacje_gangi for each row execute procedure relacje_gangi_function_trigger();

-- unable to update
create rule non_update_wiezniowie_wyroki_rule as on update to wiezniowie_wyroki do instead (select update_except());
-- dodawanie wyroku automatycznie przyporzadkue wieznia do celi jezeli nie jest przypisany
-- trigger after

create or replace function wiezniowie_wyroki_function_trigger() returns trigger as $$
begin 
    --raise exception 'no nie';
    if((select count(*) from wiezniowie_cele as "wc" 
            where wc.id_wieznia = new.id_wieznia and wc.data_wyprowadzki is null) = 0) then
            if(znajdz_id_wolnej_celi(plec_wieznia(new.id_wieznia)) is null) then
                raise exception 'Nie ma wolnej celi da wieznia';
                return old;
            end if;
            insert into wiezniowie_cele(id_wieznia,nr_celi,data_wyprowadzki,data_przydzialu) values (new.id_wieznia,znajdz_id_wolnej_celi(plec_wieznia(new.id_wieznia)),null,new.data_skazania);
    end if;
    if(not wiezien_aktywny(new.id_wieznia)) then
        insert into historia_wiezniowie values (new.id_wieznia,new.data_skazania,null,null);
    end if;
    return new;
end;
$$ language plpgsql;

create trigger wiezniowie_wyroki_trigger after insert on wiezniowie_wyroki for each row execute procedure wiezniowie_wyroki_function_trigger();

create or replace function gangi_function_trigger() returns trigger as $$
begin
	if(old.id_gangu != new.id_gangu) then
		raise exception 'Nie mozna zmienic id gangu';
		return old;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger gangi_trigger before update on gangi for each row execute procedure gangi_function_trigger();

-- data orzekniecia oraz id wyroku nie moze ulec zmianie
--drop function historia_wyroku_function_trigger;
create or replace function historia_wyroku_function_trigger() returns trigger as $$
begin
	if(old is not null) then 
		if(new.id_wyroku != old.id_wyroku or new.data_orzekniecia != old.data_orzekniecia) then
			raise exception 'Nie mozna modyfikowac wybranych wartosci';
			return old;
		end if;
	elseif(new.dlugosc_wyroku < interval '0') then
		raise exception 'Wprowadziles nieprawidlowa dlugosc wyroku';
		return old;
	end if;
	return new;
end;
$$ language plpgsql;

create trigger historia_wyroku_trigger before insert or update on historia_wyroku for each row execute procedure historia_wyroku_function_trigger();

-- nie mozna modyfikowac id_gangu, id_wieznia, oraz daty dolaczenia, date odejscia mozna ustawic tylko raz
create or replace function wiezniowie_gangi_function_trigger() returns trigger as $$
begin
    if(wiezien_aktywny2(new.id_wieznia, new.data_przystapienia) = false) then
        raise exception 'Osoba nie jest w Wiezieniu';
        return old;
    end if;

    if(old is not null) then
        if(old.data_odejscia is not null) then
            raise exception 'Nie mozna modyfikowac elementu';
            return old;
        elseif(old.data_przystapienia != new.data_przystapienia or old.id_gangu != new.id_gangu or old.id_wieznia != new.id_wieznia) then
            raise exception 'Nie mozna modyfikowac elementu';
            return old;
        end if;
    end if;
    if(new.data_odejscia <= new.data_przystapienia) then
            raise exception 'Podales zla date odejscia';
            return old;
    /*elseif((select count(*) from wiezniowie_cele as "wc" where wc.id_wieznia = new.id_wieznia and wc.data_wyprowadzki is null) != 1 
          or (select count(*) from historia_wiezniowie as "hw" where hw.id_wieznia = new.id_wieznia and hw.data_zakonczenia is null) != 1) then
          raise exception 'Wiezien nie jest obecnie w wiezieniu';
          return old;*/
    end if;
    return new;
end;

$$ language plpgsql;


create trigger wiezniowie_gangi_trigger before insert or update on wiezniowie_gangi for each row execute procedure wiezniowie_gangi_function_trigger();

-- nie mozna modyfikowac id_gangu, id_wieznia, oraz daty objecia, date zakonczenia mozna ustawic tylko raz
create or replace function historia_liderow_function_trigger() returns trigger as $$
begin
	if(old is not null) then
		if(old.data_zakonczenia is not null) then
			raise exception 'Nie mozna modyfikowac elementu';
			return old;
		elseif(old.data_objecia_przywodztwa != new.data_objecia_przywodztwa or old.id_gangu != new.id_gangu or old.id_wieznia != new.id_wieznia) then
			raise exception 'Nie mozna modyfikowac elementu';
			return old;
		end if;
	end if;
	if(new.data_zakonczenia <= new.data_objecia_przywodztwa) then
			raise exception 'Podales zla date odejscia';
			return old;
	elseif((select count(*) from wiezniowie_gangi as "wc" where wc.id_wieznia = new.id_wieznia and wc.data_odejscia is null and wc.id_gangu =  new.id_gangu ) = 0) then
		raise exception 'Wiezien nie nalezy do owego gangu';
		return old;
	end if;
	return new;
end;

$$ language plpgsql;


create trigger historia_liderow_trigger before insert or update on historia_liderow for each row execute procedure historia_liderow_function_trigger();

--

create or replace function wiezniowie_cele_function_trigger() returns trigger as $$
begin
	if(old is null) then
		if((select count(*) from wiezniowie_cele as "wc" where wc.id_wieznia = new.id_wieznia and wc.data_wyprowadzki is null) != 0 ) then
			raise exception 'Wiezien jest juz przypisany do innej celi';
			return old;
		elseif((select count(*) from wiezniowie_cele as "wc" where wc.nr_celi = new.nr_celi and wc.data_wyprowadzki is null) >= (select limit_os from cele where cele.nr_celi = new.nr_celi )) then
			raise exception 'Wybrana cela jest przepelniona';
			return old;
		end if;
	else
		if(old.id_wieznia != new.id_wieznia or old.nr_celi != new.nr_celi or old.data_przydzialu != new.data_przydzialu or old.data_wyprowadzki is not null) then
			raise exception 'Nie mozna zmodyfikowac wybranego elementu';
		end if;
	end if;
	return new;
end;

$$ language plpgsql;

create trigger wiezniowie_cele_trigger before insert or update on wiezniowie_cele for each row execute procedure wiezniowie_cele_function_trigger();

create or replace function sprawowanie_function_trigger() returns trigger as $$
begin
    if(wiezien_aktywny2(new.id_wieznia, new.data_uzyskania) = false) then
        raise exception 'Osoba nie jest w Wiezieniu';
        return old;
    end if;
    return new;
end;

$$ language plpgsql;


create trigger sprawowanie_trigger before insert or update on sprawowanie for each row execute procedure sprawowanie_function_trigger();

--


create or replace function wiezniowie_prace_function_trigger() returns trigger as $$
begin
    if(wiezien_aktywny(new.id_wieznia) = false) then
        raise exception 'Osoba nie jest w Wiezieniu';
        return old;
    end if;
    return new;
end;

$$ language plpgsql;


create trigger wiezniowie_prace_trigger before insert or update on wiezniowie_prace for each row execute procedure wiezniowie_prace_function_trigger();






















