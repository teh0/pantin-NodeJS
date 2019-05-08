# pantin-NodeJS

C'est un projet expérimental destiné à une exposition qui s'appelle "Articulation". Organisée par l'université Savoie Mont Blanc, elle réunit le travails d'étudiants de chaque formations présentes sur le campus.

## Fonctionnement du projet
Nous voulions manipuler un pantin à distance sans utiliser de manette. Seulement avec le mouvement des deux mains. 
Pour se faire, nous avons eu besoin d'une LeapMotion, d'une carte [Arduino R3]() d'une Adafruit MotorShield afin de piloter les moteurs reliés au pantins.

## Détails Techniques
Pour ce projet, nous nous sommes contentés de mettre le Client et le Serveur sur la même machine.

- **La LeapMotion**

  La Leap motion est un détecteur de mouvement qui convertit les gestes de la main en données json très détaillées (position main gauche, main droite, nombre de doigts, angle d'inclinaison du poignet...).

  Lorsqu'on la branche sur un ordinateur, elle créée un serveur Websocket sur le localhost (**http://127.0.0.1:6437**)

- **Le Client Web**

  **Dépendances utilisée**
  ```
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.dev.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leapjs/0.6.1/leap.min.js"></script>
  ```
  
  La partie principale du front repose sur 3 boutons :
  
  ```
  <button id="btn-fwd">Forward</button>
  <button id="btn-rvs">Reverse</button>
  <button id="btn-stop">Stop</button>
  ```
  Chacun de ses boutons sont lié à un évènement ```click``` en Javascript et le déclenchement de cet évènement entraînera l'envoi d'un message Websocket :
  
   ```
   let clickBtnRvs = () => {
     $('button#btn-rvs').click(() => {
        if (!lockRvs) {
           lockFwd = false;
           lockRvs = true;
           lockStop = false;
           socket.emit('rvs');
           console.log('button reverse clicked !');
         }
     });
  }
  ```
  **Comment déclencher le click des boutons ?**
  
  Dans le fichier ```remote.js``` en front, en récupère les données de la Leapmotion en utilisant la boucle de la Class ```Leap```. C'est une sorte de thread qui va s'actualiser à chaque nouvelle Frame captée par la LeapMotion
  ```
  Leap.loop(function (frame) {
   /*mes conditions*/
  });
  ```
  La variable ```frame``` est l'objet qui contient toutes les positions des mains. On peut donc faire des conditions dessus afin de déclencher des événements particuliers.
  ```
  let type = frame.hands[0].type;
  if (type == 'right' && y_hand > min_height) {
      $('button#btn-fwd').trigger("click");
  }
  ```

  Le message est donc envoyé au serveur NodeJS qui va se charger de piloter la carte Arduino.
Pour établir une connexion Websocket entre le front et le serveur, il suffit de renseigner l'adresse du serveur
  ```
  let socket = io.connect('http://127.0.0.1:4000')
  ```
  

- **Le Serveur Node**

  Nous avons utilisez les dépendances suivantes :
  - [Express]() pour le routing de notre serveur
  - [socket.io]() pour la communication en websocket
  - [johnny-five]() pour commander l'Arduino et l'Arduino Shield
  
  Pour assurer la connexion WebSocket côté serveur, il suffit d'ajouter la ligne suivante
  ```
  let socket = io.connect('http://127.0.0.1:4000')
  ```
  
  ## Le mot de la fin
  Ce projet est toujours en cours d'amélioration car nous n'avons pas pu le finir dans les temps. Nous nous assurerons d etenir à jour la documentation au fur et à mesure de l'avancée du projet.
  
  Merci d'avoir lu jusqu'au bout
