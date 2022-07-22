import React, { useEffect, useState } from "react";
import axios from "axios";
import imgEdit from "./logo.svg";
import './Calculo.css';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");

  const url = "http://localhost:8081/";

  useEffect(() => {
    fetch(url + "usuarios")
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.log(err));
  }, [url]);

  function novosDados() {
    setTipo("novo");
  }

  function cancelarDados() {
    setId("");
    setNome("");
    setEmail("");
    setTipo("");
  }

  function editarDados(cod) {
    console.log(cod);
    let usuario = usuarios.find(item => item.id === cod);
    const {id, nome, email} = usuario;
    console.log(usuario);
    setTipo("editar");
    setId(id);
    setNome(nome);
    setEmail(email);
  }

  function excluiDados(cod) {
    axios
    .delete(url + "usuarios/" + cod) 
    .then((response) => setUsuarios(usuarios.filter((item) => item.id !==cod)))
    .catch((err) => console.log(err));
  }

  function atualizaListaUsuarios(){

    setTipo("");
    setUsuarios(usuarios.filter((item) => item.id));
  }

  function calcularIMC(){

    let num1, num2, resp;
    num1 = document.getElementById("Num1").value;
    num2 = document.getElementById("Num2").value;
    resp = parseFloat(num1)/parseFloat(num2);
    document.getElementById("exibicao").innerText = "Resultado: " + resp + " kg/m²";

  }

  function gravaDados() {
    if (nome !== "" && email !== "") {
      if (tipo === "novo") {
        axios
          .post(url + "usuarios", {
            nome: nome,
            email: email,
          })
          .then((response) => atualizaListaUsuarios(response))
          .catch((err) => console.log(err));
      } else if (tipo === "editar") {
          axios.put(url + "usuarios/" + id, {
          id: id,
          nome: nome,
          email: email,
        })
        .then(response => atualizaListaUsuarios(response))
        .catch((err) => console.log(err));
      } 
    } else {
      console.log("Preencha os campos");
    }
  }

  return (
    <div className="Calc">
        <header className="Calc-header">
      <h1>
        Calculadora IMC
      </h1>
      <button type="button" onClick={novosDados}>
        START
      </button>
      {tipo ? (
        <>
          <input
            id="Num1"
            type="text"
            name="txtNome"
            placeholder="Altura (cm)"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
            }}
          />
          <input
            id="Num2"
            type="text"
            name="txtEmail"
            placeholder="Peso (kg)"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button type="button" onClick={calcularIMC}>
            Calcular
          </button>
          <button type="button" onClick={cancelarDados}>
            Cancelar
          </button>
          <button type="button" onClick={excluiDados(id)}>
            Delete
          </button>
          <button type="button" onClick={gravaDados}>
            Gravar
          </button>
          <p id="exibicao">Resultado</p>
        </>
      ) : (
        false
      )}
      {usuarios
        ? usuarios.map((item) => {
            return (
              <div key={item.id}>
                <div>
                  {" "}
                  {item.id} - {item.nome} - {item.email}{" "}
                  <img
                    alt="Editar"
                    src={imgEdit}
                    id={item.id}
                    height={20}
                    width={20}
                    onClick={(e) => editarDados(item.id)}
                  />
                </div>
              </div>
            );
          })
        : false}

          <a
            className="App-link"
            href="https://saudebrasil.saude.gov.br/ter-peso-saudavel/imc-indice-de-massa-corporal-como-calcular-seu-peso-ideal"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mais Informações sobre IMC!
          </a>

        </header>
    </div>
  );
}