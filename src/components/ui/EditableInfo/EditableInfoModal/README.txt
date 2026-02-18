Dentro de esta carpeta se encuentra el componente que se encarga de mostrar un dato editable y si se pulsa muestra un modal donde se puede cambiar el valor
Para llamarlo se importa y se usa :
<EditableInfoModal
    label={"Esto es lo que pone: Nuevo label, por ejemplo nombre o lo que sea"}
    value={El valor de eso}
    inputType={number} // Este es opcional porque por defecto está en text pero si necesitas otro tipo de dato lo indicas
/>