### Install
Docker és Git legyen a gépeteken.
```sh
git clone https://github.com/florianhennel/elte-fullstack.git
cd elte-fullstack
docker compose up --build -d
```
- Csinál 2 container-t, egyiken az adatbázis a másikon meg az api fut
- Bezárhatjátok a projektet és le is törölhetitek, amíg fut mindkét container addig működni fog.
- A Docker Desktop-ban a deno-container logjaiban látjátok a logokat ha kell
- [Postman collection](https://www.postman.com/hennelflori/workspace/elte/collection/29234285-971c8e4c-5165-48c3-8abd-18da7b0ff2f0?action=share&creator=29234285), itt láthatjátok hogy néznek ki az url-ek.

Ha törölni akarjátok a db-t vagy újra rakni:
```sh
docker compose down --volumes # törli a container-eket a volume-okkal együtt
docker compose up --build -d # ezt újra
```