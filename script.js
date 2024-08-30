document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const audioPlayer = document.getElementById('audioPlayer');
    const volumeSlider = document.querySelector('.volume-slider');
    const userCountDisplay = document.getElementById('userCount');
    const trackName = document.getElementById('trackName');
    let isPlaying = false;

    // Función para actualizar el ícono de play/pause
    const updatePlayPauseIcon = (playing) => {
        playPauseBtn.innerHTML = playing
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>`;
    };

    // Configurar el volumen inicial del reproductor de audio
    audioPlayer.volume = volumeSlider.value / 100;

    // Event Listener para controlar el volumen
    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value / 100;
    });

    // Event Listener para play/pause al hacer clic en el botón
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseIcon(isPlaying);
    });

    // Reset del ícono cuando termina la canción (aunque el loop no lo permitirá)
    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayPauseIcon(isPlaying);
    });

    // Event Listener para play/pause con la tecla Espacio
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault(); // Evita que la tecla espacio haga scroll en la página
            if (isPlaying) {
                audioPlayer.pause();
            } else {
                audioPlayer.play();
            }
            isPlaying = !isPlaying;
            updatePlayPauseIcon(isPlaying);
        }

        // Controlar el volumen con las flechas hacia arriba y hacia abajo
        if (event.code === 'ArrowUp') {
            event.preventDefault();
            if (audioPlayer.volume < 1) {
                audioPlayer.volume = Math.min(audioPlayer.volume + 0.1, 1); // Aumenta el volumen en 0.1
                volumeSlider.value = audioPlayer.volume * 100; // Actualiza el slider de volumen
            }
        }
        if (event.code === 'ArrowDown') {
            event.preventDefault();
            if (audioPlayer.volume > 0) {
                audioPlayer.volume = Math.max(audioPlayer.volume - 0.1, 0); // Disminuye el volumen en 0.1
                volumeSlider.value = audioPlayer.volume * 100; // Actualiza el slider de volumen
            }
        }
    });

    // Función para obtener información de la pista actual
    const fetchNowPlaying = () => {
        fetch('https://coderadio-admin-v2.freecodecamp.org/api/nowplaying/coderadio')
            .then(response => response.json())
            .then(data => {
                const song = data.now_playing.song;
                trackName.textContent = `${song.artist} - ${song.title}`;
            })
            .catch(error => {
                console.error('Error fetching now playing data:', error);
            });
    };

    // Llamar a la función al cargar la página y actualizar cada 30 segundos
    fetchNowPlaying();
    setInterval(fetchNowPlaying, 30000);

    // Simulación del contador de usuarios
    const updateUserCount = () => {
        let userCount = parseInt(localStorage.getItem('userCount')) || 0;
        userCount++;
        localStorage.setItem('userCount', userCount);
        userCountDisplay.textContent = `Listeners: ${userCount}`;
    };

    window.addEventListener('beforeunload', () => {
        let userCount = parseInt(localStorage.getItem('userCount')) || 0;
        userCount = Math.max(0, userCount - 1);
        localStorage.setItem('userCount', userCount);
    });

    updateUserCount(); // Actualizar el contador al cargar la página
});

