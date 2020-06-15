# HACKATHON CCR - time 136

Repositório com descrição do projeto inteiro, mas somente código do bot.

## Stack utilizada

### @meu_chapa_bot

- heroku (para subir aplicação e permitir boa execução
- docker (para facilitar desenvolvimento local)
- nodejs 12.X
- node-telegram-bot-api (SDK que integra node com api http do telegram)
- mongodb (driver em nodejs para mongodb)
- outros: express, prettier, husky, dotenv, nodemon

https://t.me/meu_chapa_bot

### Landing page

- godaddy (dominio e DNS)
- droplet digital ocean
- Wordpress
- Tema Monstroid2

https://omeuchapa.com/

## APIs

- Foi minerado e tratas as informações do https://suportebr.prf.gov.br/#/dashboard

### APIs Candidatas

- Google Maps
- Twillio SMS
- Twillio Whatsapp

## Instalando

```sh
sudo docker-compose up
```

## Rodando localmente

1. criar arquivo local .env a partir de exemplo .env.example
2. preencher .env com variáveis (principal é o TOKEN de um bot para testes)
3. rodar `docker-compose up`

ps: usar chrome://inspect -> "open dedicated DevTools for node" para que possa monitorar o console local

## Subindo o app

O app está configurado no heroku para a cada push no `master` fazer deploy novamente do app para o bot @meu_chapa_bot no
telegram

# Links

https://omeuchapa.com/

https://www.facebook.com/Meu-Chapa-110865480666209

https://www.instagram.com/omeuchapa/

https://t.me/meu_chapa_bot
