// Banco de Retos (Misión Cero Violencia)
const retos = [
    "Abrazo con permiso: Elige a alguien del grupo para darle un abrazo. ¡Eso sí! Pídele permiso primero y respeta su respuesta.",
    "Pregunta poderosa: Pregunta a un compañero: “¿Qué necesitas hoy para sentirte mejor?” Escucha sin interrumpir.",
    "Palabra que construye: Dile a un amigo una cualidad positiva que hayas notado en él.",
    "El reto del consentimiento: Inventa un saludo y pregúntale a otro jugador si quiere hacerlo contigo. Respeta el no.",
    "Respira primero: Haz 5 respiraciones profundas y luego comparte qué emoción sientes.",
    "Acto de cuidado: Ofrece ayuda a alguien del grupo en algo sencillo. Reflexiona por qué cuidar también es ser fuerte.",
    "Desafío sin estereotipos: Menciona una habilidad que no se suele asociar a la masculinidad.",
    "No es no: Simula una escena donde alguien dice NO a una actividad. Responde con respeto.",
    "Reto del reconocimiento: Agradece a un compañero por algo que haya hecho.",
    "¿Qué harías tú?: Piensa en una situación de conflicto y menciona dos formas de intervenir sin violencia.",
    "Rompe el mito: Completa: “Ser hombre NO significa…”.",
    "Escucha activa express: Escucha a un compañero 20 segundos sin interrumpir y repite lo que entendiste.",
    "El reto del perdón: Recuerda una situación donde lastimaste sentimientos y cómo habrías podido actuar distinto.",
    "Aliado por un minuto: Di una frase para apoyar a mujeres o niñas.",
    "Corresponsabilidad en acción: Menciona una tarea del hogar que harás esta semana y por qué es justo.",
    "Línea de la empatía: Menciona una situación donde alguien podría sentirse inseguro y cómo acompañarlo.",
    "Stop, piensa y elige: Describe una situación de enojo y una alternativa no violenta.",
    "El reto de la vulnerabilidad: Completa: “A veces me cuesta pedir ayuda cuando…”.",
    "Detective de emociones: Pregunta a alguien qué emoción siente hoy y por qué.",
    "Héroe real: Menciona una acción que hace a un hombre realmente valiente."
];

const adivinanzas = [
    {
        pregunta: "Lo que siempre se pregunta:<br>Antes de abrazar o jugar,<br>hay una cosa que debes usar.<br>No es un objeto ni un poder,<br>solo una palabra que debes decir primero.<br>¿Qué es?",
        respuestas: ["puedo", "pedir permiso", "permiso", "el permiso"]
    },
    {
        pregunta: "La fuerza que ayuda:<br>No se ve y no pesa nada,<br>pero hace a la gente sentirse acompañada.<br>No golpea, no grita, no manda,<br>solo escucha y a veces abraza.<br>¿Qué es?",
        respuestas: ["ser amable", "ponerse en el lugar del otro", "amabilidad", "la amabilidad", "empatía", "empatia", "ser empático", "ser empatico"]
    },
    {
        pregunta: "Lo que duele aunque no toca:<br>No tiene manos ni pies,<br>pero puede dejar un moretón.<br>Sale por la boca de alguien<br>que no piensa con el corazón.<br>¿Qué es?",
        respuestas: ["las palabras que lastiman", "palabras que lastiman", "palabras", "insultos", "malas palabras", "groserias", "gritos", "las palabras"]
    },
    {
        pregunta: "En favor de la mujer:<br>Dicen que es débil, pero no es verdad.<br>Trabaja, sueña y lucha con gran dignidad.<br>La ves en tu casa, en la escuela y en la calle,<br>y merece respeto en cada detalle.<br>¿Quién es?",
        respuestas: ["la mujer", "una mujer", "mujer", "mujeres", "las mujeres"]
    }
];

// Casillas Especiales (PORTALES, GUSANOS Y RETOS)
const casillasEspeciales = {
    // Retos distribuidos
    3: { tipo: 'reto' },
    8: { tipo: 'adivinanza' },
    12: { tipo: 'reto' },
    18: { tipo: 'reto' },
    22: { tipo: 'adivinanza' },
    28: { tipo: 'reto' },
    33: { tipo: 'reto' },
    38: { tipo: 'adivinanza' },
    42: { tipo: 'reto' },
    48: { tipo: 'adivinanza' },

    // Portales
    10: { tipo: 'portal', msg: '¡UN PORTAL MISTERIOSO!' },
    30: { tipo: 'portal', msg: '¡AGUJERO DE GUSANO!' },
    35: { tipo: 'portal', msg: '¡TELETRANSPORTACIÓN!' },

    // Gusanos (Peligro)
    15: { tipo: 'gusano', destino: 7, msg: '¡EL GUSANO MACABRO TE DEVORA!' },
    45: { tipo: 'gusano', destino: 32, msg: '¡EL GUSANO TE ESCUPE!' }
};

// ==========================================
// GAME CONSTANTS & STATE
// ==========================================
const FILAS = 7;
const COLUMNAS = 7;
const TOTAL_CASILLAS = FILAS * COLUMNAS; // 49
let jugadores = [];
let turnoActual = 0;

// ==========================================
// VIDEO CROSSFADE MANAGER
// ==========================================
const video1 = document.getElementById('bg-video-1');
const video2 = document.getElementById('bg-video-2');
let activeVideo = video1;
let nextVideo = video2;
const CROSSFADE_TIME = 2;

function startVideoLoop() {
    activeVideo.play().catch(e => console.log("Video play failed", e));
    activeVideo.ontimeupdate = () => {
        if (activeVideo.duration - activeVideo.currentTime <= CROSSFADE_TIME) {
            activeVideo.ontimeupdate = null;
            swapVideos();
        }
    };
}

function swapVideos() {
    nextVideo.currentTime = 0;
    nextVideo.play();
    nextVideo.style.opacity = 1;
    activeVideo.style.opacity = 0;
    const temp = activeVideo;
    activeVideo = nextVideo;
    nextVideo = temp;
    startVideoLoop();
}

if (video1) video1.onloadedmetadata = startVideoLoop;

// ==========================================
// DOM ELEMENTS
// ==========================================
const tablero = document.getElementById('tablero');
const btnLanzar = document.getElementById('btn-lanzar');
const infoJugador = document.getElementById('nombre-jugador');
const avatarDisplay = document.getElementById('jugador-activo-avatar');
const logContainer = document.getElementById('log-juego');
const startScreen = document.getElementById('start-screen');
const loadingScreen = document.getElementById('loading-screen');
const gameContainer = document.getElementById('game-container');
const listaJugadoresDiv = document.getElementById('lista-jugadores');
const dadoVisual = document.getElementById('dado-visual');
const audioIntro = document.getElementById('audio-intro');
const audioGameplay = document.getElementById('audio-gameplay');
const volumeSlider = document.getElementById('volume-slider');

// ==========================================
// AUDIO MANAGER
// ==========================================
document.addEventListener('click', () => {
    if (audioIntro && audioIntro.paused && audioGameplay && audioGameplay.paused) {
        audioIntro.play().catch(e => console.log("Audio play failed", e));
        if (activeVideo) activeVideo.play();
    }
}, { once: true });

if (volumeSlider) {
    if (audioIntro) audioIntro.volume = volumeSlider.value;
    if (audioGameplay) audioGameplay.volume = volumeSlider.value;
    volumeSlider.addEventListener('input', (e) => {
        const vol = e.target.value;
        if (audioIntro) audioIntro.volume = vol;
        if (audioGameplay) audioGameplay.volume = vol;
    });
}

// ==========================================
// LOADING SCREEN LOGIC
// ==========================================
window.addEventListener('load', () => {
    showLoading(() => {
        if (startScreen) {
            startScreen.style.display = 'flex';
            startScreen.style.opacity = '1';
        }
    });
});

function showLoading(callback) {
    if (!loadingScreen) return;
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';

    const bar = loadingScreen.querySelector('.loading-bar');
    if (bar) {
        bar.style.animation = 'none';
        bar.offsetHeight;
        bar.style.animation = 'loadBar 3s forwards';
    }

    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            if (callback) callback();
        }, 1000);
    }, 3000);
}

// ==========================================
// GAME START LOGIC
// ==========================================
document.querySelectorAll('.btn-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const numPlayers = parseInt(e.target.dataset.players);
        startScreen.style.display = 'none';
        showLoading(() => {
            iniciarJuego(numPlayers);
        });
    });
});

function iniciarJuego(num) {
    jugadores = [];
    for (let i = 1; i <= num; i++) {
        jugadores.push({
            id: i,
            nombre: `JUGADOR ${i}`,
            color: `p${i}`,
            posicion: 1
        });
    }

    gameContainer.style.display = 'flex';
    gameContainer.classList.add('active-game');

    crearTablero();
    actualizarListaJugadores();
    actualizarTurnoUI();
    logSystem("JUEGO INICIADO. JUGADORES: " + num);

    if (audioIntro) {
        audioIntro.pause();
        audioIntro.currentTime = 0;
    }
    if (audioGameplay) {
        audioGameplay.currentTime = 0;
        audioGameplay.play().catch(e => console.log("Gameplay audio failed", e));
    }
}

// ==========================================
// CORE GAME FUNCTIONS
// ==========================================
function crearTablero() {
    tablero.innerHTML = '';
    for (let i = TOTAL_CASILLAS; i >= 1; i--) {
        const div = document.createElement('div');
        div.classList.add('casilla');
        div.id = `casilla-${i}`;
        div.innerText = i;

        if (casillasEspeciales[i]) {
            if (casillasEspeciales[i].tipo === 'portal') {
                div.classList.add('casilla-portal');
            } else if (casillasEspeciales[i].tipo === 'gusano') {
                div.classList.add('casilla-gusano');
            } else if (casillasEspeciales[i].tipo === 'reto') {
                div.classList.add('casilla-reto');
            } else if (casillasEspeciales[i].tipo === 'adivinanza') {
                div.classList.add('casilla-adivinanza');
            }
        }
        tablero.appendChild(div);
    }
    actualizarPosicionesVisuales();
}

function actualizarPosicionesVisuales() {
    document.querySelectorAll('.ficha').forEach(e => e.remove());
    jugadores.forEach(j => {
        const casillaDiv = document.getElementById(`casilla-${j.posicion}`);
        if (casillaDiv) {
            const ficha = document.createElement('div');
            ficha.classList.add('ficha', j.color);
            const others = jugadores.filter(p => p.posicion === j.posicion && p.id !== j.id);
            if (others.length > 0) {
                const offset = (j.id - 1) * 5;
                ficha.style.transform = `translate(${offset}px, ${offset}px)`;
            }
            casillaDiv.appendChild(ficha);
        }
    });
}

function actualizarListaJugadores() {
    if (!listaJugadoresDiv) return;
    listaJugadoresDiv.innerHTML = '';
    jugadores.forEach((j, index) => {
        const card = document.createElement('div');
        card.classList.add('player-card');
        if (index === turnoActual) card.classList.add('active');

        const avatar = document.createElement('div');
        avatar.classList.add('mini-avatar');
        avatar.style.backgroundImage = `url('./assets/avatars/avatar${j.id}.png')`;

        const name = document.createElement('span');
        name.innerText = j.nombre;
        name.style.color = `var(--${j.color}-color)`;

        card.appendChild(avatar);
        card.appendChild(name);
        listaJugadoresDiv.appendChild(card);
    });
}

function actualizarTurnoUI() {
    const actual = jugadores[turnoActual];
    if (infoJugador) {
        infoJugador.innerText = actual.nombre;
        infoJugador.style.color = `var(--${actual.color}-color)`;
    }
    if (avatarDisplay) {
        avatarDisplay.style.backgroundImage = `url('./assets/avatars/avatar${actual.id}.png')`;
        avatarDisplay.style.borderColor = `var(--${actual.color}-color)`;
    }
    actualizarListaJugadores();
}

// ==========================================
// TURN & MOVEMENT LOGIC
// ==========================================
if (btnLanzar) {
    btnLanzar.addEventListener('click', async () => {
        if (btnLanzar.disabled) return;
        btnLanzar.disabled = true;

        const jugador = jugadores[turnoActual];
        let rolls = 0;
        const interval = setInterval(() => {
            const randomFace = Math.floor(Math.random() * 6) + 1;
            if (dadoVisual) {
                dadoVisual.innerText = randomFace;
                dadoVisual.className = 'dado-numero';
            }
            rolls++;
            if (rolls > 10) {
                clearInterval(interval);
                finalizarTirada(jugador);
            }
        }, 80);
    });
}

function finalizarTirada(jugador) {
    const dado = Math.floor(Math.random() * 6) + 1;
    if (dadoVisual) {
        dadoVisual.innerText = dado;
        dadoVisual.className = 'dado-numero';
    }
    logSystem(`${jugador.nombre} SACÓ [${dado}]`);
    let nuevaPosicion = jugador.posicion + dado;
    moverJugadorPasoAPaso(jugador, dado, nuevaPosicion);
}

function moverJugadorPasoAPaso(jugador, pasosRestantes, destinoFinal) {
    if (pasosRestantes > 0) {
        jugador.posicion++;
        if (jugador.posicion > TOTAL_CASILLAS) {
            jugador.posicion = TOTAL_CASILLAS;
            pasosRestantes = 0;
        }
        actualizarPosicionesVisuales();
        sonido('step');
        setTimeout(() => {
            moverJugadorPasoAPaso(jugador, pasosRestantes - 1, destinoFinal);
        }, 300);
    } else {
        if (jugador.posicion >= TOTAL_CASILLAS) {
            jugador.posicion = TOTAL_CASILLAS;
            actualizarPosicionesVisuales();
            Swal.fire({
                title: '¡JUEGO TERMINADO!',
                text: `¡${jugador.nombre} GANA LA MISIÓN!`,
                icon: 'success',
                confirmButtonText: 'REINICIAR'
            }).then(() => location.reload());
            return;
        }
        setTimeout(() => {
            verificarCasilla(jugador);
        }, 500);
    }
}

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function verificarCasilla(jugador) {
    const evento = casillasEspeciales[jugador.posicion];

    if (evento) {
        if (evento.tipo === 'portal') {
            sonido('powerup');

            let destinoRandom;
            do {
                destinoRandom = Math.floor(Math.random() * TOTAL_CASILLAS) + 1;
            } while (destinoRandom === jugador.posicion || casillasEspeciales[destinoRandom]);
            // NOTE: We allowed landing on special squares for chain reactions!

            await Swal.fire({
                title: evento.msg,
                text: `¡Te teletransportas a la casilla ${destinoRandom}!`,
                imageUrl: './assets/sprites/portal.png',
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: 'Portal',
                background: '#080808',
                color: '#ecf0f1',
                timer: 3000,
                showConfirmButton: false
            });

            jugador.posicion = destinoRandom;
            actualizarPosicionesVisuales();

            // RECURSIVE CHECK
            setTimeout(() => verificarCasilla(jugador), 500);

        } else if (evento.tipo === 'gusano') {
            sonido('hit');
            await Swal.fire({
                title: '¡PELIGRO!',
                text: evento.msg,
                imageUrl: './assets/sprites/gusano-macabro.png',
                imageWidth: 120,
                imageHeight: 120,
                imageAlt: 'Gusano Macabro',
                background: '#2c0000',
                color: '#ff0000',
                timer: 3000,
                showConfirmButton: false
            });

            jugador.posicion = evento.destino;
            actualizarPosicionesVisuales();

            // RECURSIVE CHECK
            setTimeout(() => verificarCasilla(jugador), 500);

        } else if (evento.tipo === 'reto') {
            lanzarReto(jugador);
        } else if (evento.tipo === 'adivinanza') {
            lanzarAdivinanza(jugador);
        }
    } else {
        cambiarTurno();
    }
}

function lanzarReto(jugador) {
    const r = retos[Math.floor(Math.random() * retos.length)];

    // PASO 1: Aceptar o Rechazar
    Swal.fire({
        title: '¡RETO DE MISIÓN!',
        text: r,
        imageUrl: './assets/sprites/reto.png',
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Reto',
        showCancelButton: true,
        confirmButtonText: '¡ACEPTO EL RETO!',
        cancelButtonText: 'No quiero hacerlo...',
        background: '#080808',
        color: '#fff',
        confirmButtonColor: '#27AE60', // BUTTON STYLE OVERRIDDEN BY CSS
        cancelButtonColor: '#C0392B',
        backdrop: `rgba(0,0,0,0.8)`,
        allowOutsideClick: false,
        customClass: {
            confirmButton: 'swal2-confirm',
            cancelButton: 'swal2-cancel'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // PASO 2: Verificar Cumplimiento
            Swal.fire({
                title: '¿LO LOGRASTE?',
                text: 'Sé honesto, ¿cumpliste el reto?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '¡SÍ, LO HICE!',
                cancelButtonText: 'No pude...',
                background: '#080808',
                color: '#fff',
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'swal2-confirm',
                    cancelButton: 'swal2-cancel'
                }
            }).then((res2) => {
                if (res2.isConfirmed) {
                    // PREMIO
                    const premio = Math.floor(Math.random() * 6) + 1;
                    Swal.fire({
                        title: '¡VALIENTE!',
                        text: `¡Tu valentía tiene recompensa! Avanzas ${premio} casillas.`,
                        icon: 'success',
                        background: '#080808',
                        color: '#F1C40F',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        avanzar(jugador, premio);
                        // RECURSIVE CHECK AFTER REWARD MOVE
                        setTimeout(() => verificarCasilla(jugador), 500);
                    });
                } else {
                    // PENALIZACIÓN
                    const castigo = 2;
                    Swal.fire({
                        title: '¡INTÉNTALO LUEGO!',
                        text: `La honestidad es clave. Retrocedes ${castigo} casillas por no cumplirlo.`,
                        icon: 'warning',
                        background: '#080808',
                        color: '#fff',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        retroceder(jugador, castigo);
                        // RECURSIVE CHECK AFTER PENALTY MOVE
                        setTimeout(() => verificarCasilla(jugador), 500);
                    });
                }
            });
        } else {
            // PENALIZACIÓN POR RECHAZAR
            const castigoRandom = Math.floor(Math.random() * 6) + 1;
            Swal.fire({
                title: '¡RETIRADA!',
                text: `Rechazar un reto tiene consecuencias... Retrocedes ${castigoRandom} casillas.`,
                icon: 'error',
                background: '#080808',
                color: '#C0392B',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                retroceder(jugador, castigoRandom);
                // RECURSIVE CHECK AFTER PENALTY MOVE
                setTimeout(() => verificarCasilla(jugador), 500);
            });
        }
    });
}

function avanzar(jugador, cantidad) {
    jugador.posicion += cantidad;
    if (jugador.posicion > TOTAL_CASILLAS) jugador.posicion = TOTAL_CASILLAS;
    actualizarPosicionesVisuales();
    sonido('powerup');
}

function retroceder(jugador, cantidad) {
    jugador.posicion -= cantidad;
    if (jugador.posicion < 1) jugador.posicion = 1;
    actualizarPosicionesVisuales();
    sonido('hit');
}

function cambiarTurno() {
    turnoActual = (turnoActual + 1) % jugadores.length;
    actualizarTurnoUI();
    if (btnLanzar) btnLanzar.disabled = false; // RE-ENABLE BUTTON
    logSystem(`TURNO: ${jugadores[turnoActual].nombre}`);
}

function logSystem(msg) {
    const line = document.createElement('div');
    line.classList.add('log-line');
    line.innerText = `> ${msg}`;
    if (logContainer) logContainer.prepend(line);
}

function lanzarAdivinanza(jugador) {
    const adivinanza = adivinanzas[Math.floor(Math.random() * adivinanzas.length)];

    Swal.fire({
        title: '¡ADIVINANZA!',
        html: `<div style="text-align: left; font-size: 1.1em; line-height: 1.5;">${adivinanza.pregunta}</div>`,
        imageUrl: './assets/sprites/adivinanza.png',
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Adivinanza',
        input: 'text',
        inputLabel: 'Tu respuesta:',
        inputPlaceholder: 'Escribe aquí...',
        showCancelButton: true,
        confirmButtonText: 'RESPONDER',
        cancelButtonText: 'PASAR',
        background: '#080808',
        color: '#fff',
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        customClass: {
            confirmButton: 'swal2-confirm',
            cancelButton: 'swal2-cancel',
            input: 'swal2-input-custom'
        },
        preConfirm: (respuesta) => {
            if (!respuesta) {
                Swal.showValidationMessage('¡Debes escribir una respuesta!');
            }
            return respuesta;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const respuestaUsuario = result.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            // Check normalized answers
            const esCorrecta = adivinanza.respuestas.some(resp => {
                const respNorm = resp.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return respuestaUsuario === respNorm || respuestaUsuario.includes(respNorm);
            });

            if (esCorrecta) {
                const premio = 3;
                Swal.fire({
                    title: '¡CORRECTO!',
                    text: `¡Muy bien! Avanzas ${premio} casillas.`,
                    icon: 'success',
                    background: '#080808',
                    color: '#27AE60',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    avanzar(jugador, premio);
                    setTimeout(() => verificarCasilla(jugador), 500);
                });
            } else {
                const castigo = 1;
                Swal.fire({
                    title: '¡INCORRECTO!',
                    text: `La respuesta no es correcta. Retrocedes ${castigo} casilla.`,
                    icon: 'error',
                    background: '#080808',
                    color: '#C0392B',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    retroceder(jugador, castigo);
                    setTimeout(() => verificarCasilla(jugador), 500);
                });
            }
        } else {
            // Cancelled/Passed
            const castigo = 1;
            Swal.fire({
                title: '¡PASASTE!',
                text: `Al no intentar, retrocedes ${castigo} casilla.`,
                icon: 'warning',
                background: '#080808',
                color: '#F39C12',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                retroceder(jugador, castigo);
                setTimeout(() => verificarCasilla(jugador), 500);
            });
        }
    });
}

function sonido(tipo) {
    if (audioGameplay && !audioGameplay.paused) {
        // Simple sfx placeholder - in a real app better sfx management
    }
}
