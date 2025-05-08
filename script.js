function generarSucesion() {
  const m = parseInt(document.getElementById("limiteInferior").value);
  const n = parseInt(document.getElementById("limiteSuperior").value);
  let formula = document.getElementById("formula").value;
  const salida = document.getElementById("resultado");

  salida.innerHTML = "";

  if (isNaN(m) || isNaN(n) || formula.trim() === "") {
    salida.innerHTML = "Por favor llena todos los campos correctamente.";
    return;
  }

  if (m > n) {
    salida.innerHTML = "⚠️ El límite inferior no puede ser mayor que el superior.";
    return;
  }

  // Detectar y reemplazar cualquier letra usada como variable por "k"
  const letras = formula.match(/[a-zA-Z]/g);
  const letrasFiltradas = letras ? letras.filter(l => !["M", "a", "t", "h"].includes(l)) : [];

  if (letrasFiltradas.length > 0) {
    const variable = letrasFiltradas[0];
    const regex = new RegExp(variable, "g");
    formula = formula.replace(regex, "k");
  }

  let suma = 0;
  let multiplicacion = 1;
  let detalles = "";

  for (let k = m; k <= n; k++) {
    let ak = evaluarFormula(formula, k);
    if (ak === null || isNaN(ak)) {
      salida.innerHTML = "⚠️ Error al evaluar la fórmula. Revisa la sintaxis.";
      return;
    }

    let expresionSustituida = formula.replaceAll("k", `(${k})`);
    detalles += `Término a(${k}) = ${expresionSustituida} = ${ak.toFixed(4)}<br>`;
    suma += ak;
    multiplicacion *= ak;
  }

  salida.innerHTML = `
    ${detalles}
    <br><strong>Suma = ${suma}</strong><br>
    <strong>Multiplicación = ${multiplicacion}</strong>
  `;
}

function evaluarFormula(f, k) {
  try {
    // Reemplazar constantes conocidas
    f = f.replaceAll("pi", "Math.PI");
    f = f.replaceAll("e", "Math.E");

    // Multiplicación implícita
    f = f.replace(/(\d)([a-zA-Z])/g, "$1*$2"); // 2k -> 2*k
    f = f.replace(/([a-zA-Z])(\d)/g, "$1*$2"); // k2 -> k*2
    f = f.replace(/([)\d])\(/g, "$1*(");       // 2(k+1) -> 2*(k+1)
    f = f.replace(/\)([^\*\+\-\/\)\s])/g, ")*$1"); // (k+1)2 -> (k+1)*2

    return Function(`"use strict"; let k=${k}; return ${f}`)();
  } catch {
    return null;
  }
}
