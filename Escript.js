const Api_URL="http://localhost:3000";
//Comprobar conexion api
async function comprobarapi(){
    const estadodiv = document.getElementById("estadoapi");
    try{
        const respuesta = await fetch(`${Api_URL}/`);
        const datos = await respuesta.json();
        estadodiv.innerHTML=`<strong>Api Zod Conectada</strong>-${datos.mensaje}`;
        estadodiv.className = "estado_api conectado";
    }catch(error){
        estadodiv.innerHTML=`<strong>Api Zod Desconectada</strong>-Iniciar la Api`;
        estadodiv.className = "estado_api desconectado";                
    }
}
//Funcion de Validación
async function validar() {
    // Obtener datos
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const edad = document.getElementById("edad").value;
    const isAdmin = document.getElementById("admin").checked;
    
    //Limpiar resultados
    const frontdiv = document.getElementById("resultadofront");
    const backdiv = document.getElementById("resultadoback");
    frontdiv.className = "resultado_front";
    backdiv.className = "resultado_back";
    frontdiv.innerHTML = "";
    backdiv.innerHTML = "";
    
    //Validacion en Front
    const erroresFront=[];
    // Validar nombre 
    if(!nombre || nombre.length < 3) {
        erroresFront.push("nombre: El nombre debe tener al menos 3 caracteres");
    }
    // Validar email
    if(!email || !email.includes("@")|| !email.includes(".com")) {
        erroresFront.push("email: Email inválido");
    }
    // Validar edad
    if(edad){
        if (edad < 16 || edad > 60) {
            erroresFront.push("edad: Debe estar entre 16 y 60");
        }
    }
    // Mostrar errores del frontend
    if(erroresFront.length > 0){
        frontdiv.className = "resultado_front error";
        frontdiv.innerHTML = `<strong>Errores de validación:</strong><br>${erroresFront.join("<br>")}`;
        // Si hay errores en el frontend no continua con backend
        return; 
    }else{
        frontdiv.className = "resultado_front exito";
        frontdiv.innerHTML = `<strong>Validación local correcta</strong>`;
    }
    //Validación en Back
    try{
        const Edad=parseInt(edad);
        const respBack = await fetch(`${Api_URL}/back`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, edad: Edad, isAdmin })
        });
        const dataBack = await respBack.json();
        //Respuesta del backend
        if (dataBack.ok) {
            backdiv.className = "resultado_back exito";
            backdiv.innerHTML = `<strong>Backend Info:</strong><br><pre>${JSON.stringify(dataBack.data,null,2)}</pre>`;
        } else {
            backdiv.className = "resultado_back error";
            backdiv.innerHTML = `<strong>Backend Info:</strong><br>${dataBack.errores.join('<br>')}`;
        }
    } catch(error) {
        backdiv.className = "resultado_back error";
        backdiv.innerHTML = `<strong>Error de conexión:</strong><br>${error.message}`;
    }
}
comprobarapi();
setInterval(comprobarapi,4000);