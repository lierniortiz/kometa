# Kometa

Esta configuración es para fines académicos, ya que todo correrá localmente si se realiza de la forma explicada a continuación:
## Instalar dependencias necesarias
1. node.js
2. Truffle
```
npm install -g truffle
```
3. Ganache. https://www.trufflesuite.com/ganache
4. Metamask. https://metamask.io/download.html
5. Node Package Manager (es necesaria la carpeta node_modules)
```
npm install
```

## Desplegar el contrato
Abrir Ganache (con quickstart es suficiente) y desplegar el contrato:
```
truffle migrate
```
Si no se quiere utilizar la red local Ganache, el contrato está desplegado en la dirección 0xb132e9a86a95293b1ea483096677e70c2991cf99 de la red Ropsten. Por lo que se puede establecer este dato en la línea 55 de app.js y utilizar dicha red para hacer pruebas. 

## Interactuar con la web
```
npm run start
```
