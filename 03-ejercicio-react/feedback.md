Buen trabajo!
Hicimos algunos cambios, sobre todo en `useFilters()` con la aparición de `useMemo`.

Cuando quieras cambiar el valor de una variable SOLO cuando un estado cambia, es una buena señal de que podemos usar `useMemo`. Con esto nos aseguramos de que SOLO va a cambiar cuando el estado mute.