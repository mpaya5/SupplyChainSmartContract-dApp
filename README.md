# SupplyChainSmartContract-dApp

```
apology = "Proyecto no terminado todavía.\n"
print(apology)
/*
Ve al final para ver que falta
*/

```

Proyecto de creación de un "SupplyChain App", que es basicamente un framework que conecto productores a consumidores y manejar los productos y los servicios durante el trayecto.

## ¿Porqué usar la tecnología Blockchain?

Porqué queremos reducir el coste de los `middlemen` y ofrecer transparencia y visibilidad. Pero, ¿qué es un middlemen? Son aquellos intermediarios que se encuentran entre el productor y el consumidor.

## ¿Cómo lo hacemos? 

Para hacerlo vamos a necesitar almacenar datos, en general cuatro tipos:

- ASSETS: Un `asset` es el producto que podrá ser comprado por el consumidor. 
- PARTICIPANTS: Los participantes serán todo aquella identidad que participen en el `Supply Chain`. Pueden ser fabricantes, proveedores, vendedores y consumidores.
- OWNERSHIP: Entonces, tenemos `assets` que serán "movidos" por los participantes. Para asociar un `asset` con un participante necesitaremos controlar el `ownership` del mismo. Una estructura de `ownership` determina que participante es dueño de un producto actualmente o en qué momento fue dueño de ese producto. Esto nos proporciona la capacidad de poder hacer tracking de un producto a lo largo del tiempo.
- TOKEN: Con un token podremos ser capaces de definir los datos de como los participantes se pagan entre ellos.


También, tenemos que definir las funciones del token que vamos a usar para poder darle uso y usarla dentro de nuestra aplicación.

- Initialize Tokens: Entonces en el momento que creamos nuestra cadena de suministro por primera vez, queremos inicalizar un grupo de tokens para los pagos.
- Transfer Tokens: Función que nos permitirá transferir los tokens entre los participantes.
- Authorize Tokens Payment: Para poder permitir transferencias de tokens en nombre de un participante.

Para poder darle "vida" a nuestra `Supply Chain` App debemos de crear varias funciones:

- Add and update Participants.
- Move products along the Supply Chain
  - Transfer product ownership
- Add and update products
- Track an asset
  - Where a product is today
  - Find product provenance (ownership)

## TODO
- Terminar las funciones y documentarlas
- Chequear que funcionan correctamente y que las ejecuta correctamente con Truffle y Ganache
- Añadir más `capabilities` según vamos trabajando
