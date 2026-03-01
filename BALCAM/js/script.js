// 🔹 Conexión Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabaseUrl = "https://gwvqttdjevogjvldzspf.supabase.co"
const supabaseKey = "sb_publishable_e1x6gdl3QHjwdKa5UIjYxQ_eMkUaTad"

export const supabase = createClient(supabaseUrl, supabaseKey)


// 🔹 LOGIN (solo si existe formulario)
const form = document.querySelector("form")

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.querySelector('input[type="email"]').value
    const password = document.querySelector('input[type="password"]').value

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert("Correo o contraseña incorrectos")
    } else {
      window.location.href = "Panel.html"
    }
  })
}
// 🔹 Cargar usuarios
window.cargarUsuarios = async function () {

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")

  if (error) {
    console.error(error)
    alert("Error cargando usuarios")
    return
  }

  const tabla = document.getElementById("tablaUsuarios")
  if (!tabla) return

  tabla.innerHTML = ""

  data.forEach(usuario => {
    tabla.innerHTML += `
      <tr>
        <td>${usuario.primer_nombre ?? ""}</td>
        <td>${usuario.primer_apellido ?? ""}</td>
        <td>${usuario.rol ?? ""}</td>
        <td>${usuario.activo ? "Sí" : "No"}</td>
      </tr>
    `
  })
}