
let usuario = null;
let  socket = null;



var url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth?prod=algo'
    : 'https://rest-server-angelldca.herokuapp.com/api/auth?prod=algo';



    // referencias Html
   const txtUid  = document.querySelector("#txtUid");
   const txtMensaje= document.querySelector("#txtMensaje");
   const ulUsuarios= document.querySelector("#ulUsuarios");
   const ulMensaje= document.querySelector("#ulMensaje");
   const btnLogout= document.querySelector("#btnLogout");




//validar jwt del localstorage
const validarJWT= async()=>{
          const token = localStorage.getItem('token')|| '';
          if(token.length <=10){
              window.location = 'index.html';
              throw new Error("no hay token ");
          }

          const resp = await fetch(url,{
              headers:{'x-token':token}
          });
          const {usuario:userDb, token:tokenDb} = await resp.json();
          usuario= userDb;
          document.title = usuario.nombre;
        
          await conectarSocket();
}

const conectarSocket = async ()=>{
    socket = io({
        'extraHeaders':{
            'x-token':localStorage.getItem('token')
        }
    });

    socket.on('connect',()=>{
        console.log("Soket online");

    });
    socket.on('disconnect',()=>{
        console.log("Soket offline")
    });
    socket.on('recibir-mensajes',dibujarMensajes);
    socket.on('usuarios-activos',dibujarusuarios);

    socket.on('mensaje-privado',(payload)=>{
         console.log("mensaje Privado : ",payload);
    });
}

const dibujarusuarios = (usuarios= [])=>{
       let userhtml = '';
       usuarios.forEach(({nombre, uid})=>{
           userhtml += `
           <li>
           <p>
           <h5 class="text-success">${nombre}</h5>
           <span class = "fs-6 text-muted">${uid}</span>
           </p>
           </li>
           `;
       });
       ulUsuarios.innerHTML =userhtml;
}

const dibujarMensajes = (mensajes= [])=>{
    let mensajeshtml = '';
    mensajes.forEach(({nombre, mensaje})=>{
        mensajeshtml += `
        <li>
        <p>
        <span class="text-primary">${nombre}:</span>
        <span ">${mensaje}</span>
        </p>
        </li>
        `;
    });
    ulMensaje.innerHTML =mensajeshtml;
}

txtMensaje.addEventListener('keyup',({keyCode})=>{
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
     if(keyCode !== 13){
        //socket.emit('escribiendo',"Escribiendo....");
         return
     }
     if(mensaje.length ===0 || mensaje === " "){return;}
     socket.emit('enviar-mensaje',{mensaje,uid});
     txtMensaje.value='';
})
const main = async () => {
     
    await validarJWT();


}


main();


//const socket = io();