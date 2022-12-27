# Clase 42
## ESQUEMA API RESTful

Revisar en forma completa el proyecto entregable que venimos realizando, refactorizando y reformando todo lo necesario para llegar al esquema de servidor API RESTful en capas planteado en esta clase.

Asegurarse de dejar el servidor bien estructurado con su ruteo / controlador, negocio, validaciones, persistencia  configuraciones (preferentemente utilizando en la codificación clases de ECMAScript).

No hace falta realizar un cliente a que utilizaremos test para verificar el correcto funcionamiento de las funcionalidades.

---
## TESTEAMOS NUESTRA API REST
Desarrollar un cliente HTTP de pruebas que utilice Axios para enviar peticiones,  realizar un test de la funcionalidad hacia la API Rest de productos, verificando la correcta lectura de productos disponibles, incorporación de nuevos productos, modificación y borrado.

Realizar el cliente en un módulo independiente y desde un código aparte generar las peticiones correspondientes, revisando los resultados desde la base de datos y en la respuesta del servidor obtenida en en cliente HTTP.

Luego, realizar las mismas pruebas, a través de un código de test apropiado, que utilice mocha, chai y Supertest, para probar cada uno de los métodos HTTP de la API Rest de productos.

Escribir una suite de test para verificar si las respuestas a la lectura, incorporación, modificación y borrado de productos son las apropiadas. Generar un resporte con los resultados obtenidos de la salida del test.