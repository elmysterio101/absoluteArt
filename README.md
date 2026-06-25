# absoluteArt
En principio un editor grafico basado en Paint de w11 pero con intención de mejorarlo , el objetivo es llevarlo hacerlo totalmente portable y que funcione tan solo en 1 canvas , todo utilizando js vanilla sin nada mas de lo necesario

en proceso de creacion de sistema de capas, enduda de tener o no agrupacion de capas , tengo que decidirlo y seguir , estoy en fecha de parciales asi que se pausa momentaneamente o hasta que me aburrra devuelta 

correccion de bug al pintar trazos , al guardar un trazo en historial se pintaba directamente en su canvas correspondiente, pero al guardar captura se volvio a a hacer y si era n trazo de alpha != 0 o 1 se veia la diferencia  , para solucionarlo lo puse directamente en el if que revisaba si se guardaba captura, justamente agregue un else y puse ese pintado de trazo ahi.

https://absoluteart.vercel.app/
