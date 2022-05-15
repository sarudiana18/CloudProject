# Get Direction details between two locations
Get Direction details between two locations este o aplicație care permite utilizatorului sa trimita un mail unei alte persoane sau propriei persoane, introducand numele sau, numele a doua locatii pentru a afla durata si distanta de parcurgere intre cele doua locatii, si in final mailul persoanei careia doreste sa ii transmita aceste informatii.
# 1. Introducere
Partea de backend a aplicatiei permite accesul la date prin intermediul a două API-uri (DirectionsAPI și SendGrid) dezvoltate cu Node.js, iar partea de frontend conține o interfață dezvoltată utilizând React.js. Datele sunt stocate in baza de date MySQL Workbrench.

# 2. Descriere problemă
Prin intermediul acestei aplicatii utilizatorul poate vedea distanta de la o locatie la alta si durata totala in care poate fi parcursa aceasta distanta, totodata putand transmite aceasta informatie unei alte persoane, posibil partener de calatorie, introducand in interfata mailul acestuia.
# 3. Descriere API
1.	DIRECTIONS API – este un serviciu web care utilizeaza un http request pentru a returna un document json sau xml-formatted (in cazul aplicatiei mele, am folosit fisierul json) care contine directiile de calatorie dintre 2 locatii. Astfel, pentru a face un request catre acest serviciu avem nevoie in cazul nostru de 2 parametrii, si anume originea (locatia de la care vrem sa pornim) si destinatia. Fisierul returnat este de tipul JSON si contine mai multe detalii de navigare, longitudinea si latitudinea celor doua locatii, toti pasii necesari acestei navigari si detalii privind fiecare pas, impreuna cu multe alte detalii, insa pentru proiectul meu am extras durata totala si distanta totala de parcurgere.
2.	SENDGRID API -  este folosit pentru a trimite mailuri in Cloud folosind o cheie api, prin intermediul platformei SendGrid. Acest API key implica crearea unui cont SendGrid. Pentru a trimite un request avem nevoie de mailul persoanei care trimite mailu, mailul persoanei careia vrem sa trimitem mailul, un subiect si continutul mailului.

# 4. Flux de date
# Frontend:
In fisierul index.js se va face apel prin root.render() la componenta App.js, care de altfel include componenta MainPage, reprezentand punctul de pornire al interfatei.
<img width="429" alt="2022-05-14 (5)" src="https://user-images.githubusercontent.com/105063916/168442250-d84f4d6f-8920-4983-a413-eca0abfb9fc4.png">

<img width="381" alt="2022-05-14 (6)" src="https://user-images.githubusercontent.com/105063916/168442258-dae8c5dc-5256-473c-98ce-60671475619f.png">

Fisierul MainPage.jsx include un header care contine titlul aplicatiei „Send a mail with direction details between 2 locations” si doua div-uri, cu directii catre MessagesSubmit si MessagesList. 
<img width="483" alt="2022-05-14 (7)" src="https://user-images.githubusercontent.com/105063916/168442261-d2375347-eb88-4a7f-a5b0-7aebfc2ffb74.png">

Componenta MessagesList, aflata in partea dreapta face un apel catre server prin cheia REACT_APP_API_URL si aduce toate mesajele din tabela Messages din baza de date. 
REACT_APP_API_URL = „http://localhost:8080”

<img width="387" alt="2022-05-14 (9)" src="https://user-images.githubusercontent.com/105063916/168442278-09e42cc6-725f-4090-bb7a-ba6b30389678.png">

Componenta MessagesSubmit prezinta un form prin care utilizatorul introduce numele sau, numele a doua locatii pentru a afla durata si distanta de parcurgere intre cele doua locatii, si in final mailul persoanei careia doreste sa ii transmita aceste informatii. 

<img width="842" alt="2022-05-14 (12)" src="https://user-images.githubusercontent.com/105063916/168442300-d4fb2bfd-7f9f-4ce3-a73f-93ad81044edc.png">

Dupa ce a completat toate input-urile vizibile in pagina, utilizatorul va apasa un buton care face apel la server, folosind aceea cheie de mai sus: REACT_APP_API_URL care va aduce informatiile cerute in legatura cu distanta si durata dintre cele doua locatii. In cadrul acestui request, pentru parametrul senderMail este folosita o constanta, mapata in fisierul „constants.js” cu mailul persoanei care trimite aceste informatii. (mailul utilizatorului aplicatiei).

<img width="803" alt="2022-05-14 (10)" src="https://user-images.githubusercontent.com/105063916/168442309-52fd1583-a8f5-4131-a7ab-d2ca80ba2296.png">


Mai departe, toate functionalitatile vor fi preluate de server, mai exact in proiectul de Backend, iar dupa apelul catre server, se va afisa o notificare cu mesajul trimis prin mail.
# Backend
Pentru inceput, proiectul de backend va face conexiunea la baza de date folosind urmatoarele chei, mapate in fisierul env: INSTANCE_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME.

 Se definesc rutele: /messages pentru componenta messagesRouter si /utils pentru componenta utilsRouter.
 
 Cele doua apeluri din front-end catre back-end, atat cel care aduce mesajele existe, cat si cel care aduce durata si distanta dintre cele doua locatii si care trimite mailul, se vor face prin ruta principala REACT_APP_API_URL /messages. 
 
Aducerea tuturor mesajelor existente se face prin metoda get de http pentru serviciile REST, facand un simplu read, fiind un query catre baza de date cu SELECT * from messages. 
<img width="785" alt="2022-05-14 (2)" src="https://user-images.githubusercontent.com/105063916/168442342-bb3684b6-9056-4714-a534-d203b78510e6.png">

Request-ul pentru aducerea detaliilor de calatorie se va face printr-un POST de aceasta data, deoarece, avand un body, se va insera in baza de date o noua inregistrare.  

 In primul rand, se va apela functia getDirection care utilizeaza DirectionsAPI (implicit un DirectionAPIKey folosit in request-ul de get) pentru aducerea unui fisier json, din care extragem durata toata si distanta toatala. 
 
  Se va crea un mesaj cu raspunsul primit, pentru a fi introdusa inregistrarea in baza de date si pentru a trimite mailul prin Api-ul specific SendGrid (implicit fiind necesar un SendGridApiKey). 

<img width="881" alt="2022-05-14 (3)" src="https://user-images.githubusercontent.com/105063916/168442366-628c3ab7-b7bd-4aab-9141-604c63ffae1a.png">

<img width="960" alt="2022-05-14 (4)" src="https://user-images.githubusercontent.com/105063916/168442367-43eb0b33-e408-4362-b901-35b8419c994b.png">

Versiunea de Node.js utilizată la implementare este v16.14.2.
# 4.1 Exemple de request - response
Au fost realizate cu ajutorul Postman. 

Exemplu de request din utilsRouter: utils/directionInfo care primeste ca parametrii „from” (locatia de unde se porneste) si „to” (destinatia) si primeste ca raspuns un array directionInfo care are doua proprietati: durata si distanta.

Exemplu de request din messagesRouter: messages/:id , prin metoda PUT care face un update pentru un mesaj existent in baza de date. Primeste ca parametru id-ul si obtine ca raspuns mesajele existente si actualizate din bd (inregistrarile din tabela messages).

Exemplu de request pentru DirectionsAPI: este un request de tipul get, ca in urmatorul exemplu:
`https://maps.googleapis.com/maps/api/directions/json?origin=Bucuresti&destination=Timisoara&key=YOUR_API_KEY`, si primeste ca raspuns un json care contine mai multe detalii de navigare, longitudinea si latitudinea celor doua locatii, toti pasii necesari acestei navigari si detalii privind fiecare pas, impreuna cu multe alte detalii.



# 4.2. Metode HTTP
	DirectionsAPI: Get;
	MessagesRouter: PUT, POST, GET, GET(/:id), DELETE(/:id), POST (/direction)
	UtilsRouter: POST (/directionInfo), POST (/send)
 # Link video:
 https://www.youtube.com/watch?v=SLAYHI-jBic 
 
# Linkuri github:
https://github.com/sarudiana18/CloudProject-Front - frontend

https://github.com/sarudiana18/CloudProject - backend
# Referinte:
https://developers.google.com/maps/documentation/directions/start

https://sendgrid.com/why-sendgrid/
# Publicare: linkuri
Backend: https://dashboard.heroku.com/apps/rocky-citadel-84785

https://git.heroku.com/rocky-citadel-84785.git

Frontend: https://dashboard.heroku.com/apps/lit-headland-74393 

https://git.heroku.com/lit-headland-74393.git 

<img width="960" alt="2022-05-14" src="https://user-images.githubusercontent.com/105063916/168442393-4a498b8a-3650-4327-9d46-daf161d6f3df.png">
