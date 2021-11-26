interface Game {
   id: number;
   title: string;
   description: string;
   ageRating: string;
}

interface GameInLibrary {
   id: number;
   time_played: number;
   is_visible: boolean;
}

interface User {
   id: number;
   username: string;
   library: GameInLibrary[];

}

interface Data {
   games: Game[];
   users: User[];
}

export var data: Data =
{
   games:
      [
         {
            id: 0,
            title: "Mirror's Edge",
            description: "In a city where information is heavily monitored, couriers called Runners transport sensitive data. In this seemingly utopian paradise, a crime has been committed, & you are being hunted. You are a Runner called Faith and this innovative first-person action-adventure is your story.",
            ageRating: "T"
         },
         {
            id: 1,
            title: "Deus Ex: Game of the Year Edition",
            description: "The year is 2052 and the world is a dangerous and chaotic place. Terrorists operate openly - killing thousands; drugs, disease and pollution kill even more. The world's economies are close to collapse and the gap between the insanely wealthy and the desperately poor grows ever wider.",
            ageRating: "M"
         },
         {
            id: 2,
            title: "Titanfall 2",
            description: "Respawn Entertainment gives you the most advanced titan technology in its new, single player campaign & multiplayer experience. Combine & conquer with new titans & pilots, deadlier weapons, & customization and progression systems that help you and your titan flow as one unstoppable killing force.",
            ageRating: "M"
         },
         {
            id: 3,
            title: "FINAL FANTASY XIV Online",
            description: "Take part in an epic and ever-changing FINAL FANTASY as you adventure and explore with friends from around the world.",
            ageRating: "T"
         }
      ],
   users:
      [
         {
            id: 0,
            username: "xXx_sephiroth1997_xXx",
            library:
               [
                  {
                     id: 3,
                     time_played: 400,
                     is_visible: true
                  },
                  {
                     id: 2,
                     time_played: 10,
                     is_visible: true
                  },
               ]
         },
         {
            id: 1,
            username: "Gregor",
            library:
               [
                  {
                     id: 2,
                     time_played: 175,
                     is_visible: true
                  },
                  {
                     id: 1,
                     time_played: 230,
                     is_visible: true
                  },
               ]
         },
      ]
}
