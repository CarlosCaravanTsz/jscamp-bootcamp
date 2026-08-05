<!-- Aquí puedes dejar las dudas que tengas sobre el ejercicio -->
1) Es buena idea usar el patron de valores por defecto en limit y offset?
2) 

**Respuesta 1**:
Si, es buena idea siempre que tenga sentido. En limit y offset es uno de estos casos. Podemos llamar mucho a esa función y es bueno que siempre que se llame, use los mismos valores, a no ser que intencionalmente queramos cambiarlo.

Ahora, con respecto a `minAge` y `maxAge`, es mala idea, porque si queremos obtener todos los usuarios, y justo agregamos uno con 105 años, ya no va a salir.

La idea es la siguiente:
- Para `limit` y `offset`, si no se pasan, que tome los valores por defecto. Si tenemos 10000 usuarios, obtendríamos todos, y eso es un problema de performance.
- Para `minAge` y `maxAge`, si no se pasan, lo ideal es que no aplique limitantes, porque puede perjudicar a los resultados.