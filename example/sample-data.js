module.exports = {
		survivor: [
            { sid: 1, name: "Hugo Reyes", fk_actor_character_id: 2 },
            { sid: 2, name: "Sayid Jarrah"},
            { sid: 3, name: "Jack Shephard", fk_actor_character_id: 1 },
            { sid: 4, name: "James Ford"},
            { sid: 5, name: "Jin Kwon"},
            { sid: 6, name: "Sun Kwon"},
            { sid: 7, name: "Kate Austen"},
            { sid: 8, name: "John Locke"},
            { sid: 9, name: "Claire Littleton"},
            { sid: 10, name: "Ben Linus"},
            { sid: 11, name: "Desmond Hume"},
            { sid: 12, name: "Charlie Pace"},
            { sid: 13, name: "Libby Smith"},
            { sid: 14, name: "Anna Lucia Cortez"}
        ],
        group: [
            { id: 1, name: "castaways"},
            { id: 2, name: "tailies" },
            { id: 3, name: "others" },
            { id: 4, name: "oceanic6" }
        ],
        junction_groups_group_survivor: [
            { survivor_sid: 1, group_id: 1 },
            { survivor_sid: 1, group_id: 4 },
            { survivor_sid: 2, group_id: 1 },
            { survivor_sid: 2, group_id: 4 },
            { survivor_sid: 3, group_id: 1 },
            { survivor_sid: 3, group_id: 4 },
            { survivor_sid: 4, group_id: 1 },
            { survivor_sid: 5, group_id: 1 },
            { survivor_sid: 6, group_id: 1 },
            { survivor_sid: 6, group_id: 4 },
            { survivor_sid: 7, group_id: 1 },
            { survivor_sid: 7, group_id: 4 },
            { survivor_sid: 8, group_id: 1 },
            { survivor_sid: 9, group_id: 1 },
            { survivor_sid: 10, group_id: 3 },
            { survivor_sid: 12, group_id: 1 },
            { survivor_sid: 13, group_id: 1 },
            { survivor_sid: 13, group_id: 2 },
            { survivor_sid: 14, group_id: 1 },
            { survivor_sid: 14, group_id: 2 }
        ],
        station: [
            { id: 1, name: "Flame", fk_group_station_id: 1 },
            { id: 2, name: "Arrow", fk_group_station_id: 2 },
            { id: 3, name: "Pearl", fk_group_station_id: 3 },
            { id: 4, name: "Swan", fk_group_station_id: 4 },
            { id: 5, name: "Hydra" },
            { id: 6, name: "Orchid" },
            { id: 7, name: "Staff" },
            { id: 8, name: "Looking Glass" },
            { id: 9, name: "Tempest" },
            { id: 10, name: "Lamp Post" }
        ],
        actor: [
            { id: 1, name: 'Matthew Fox'},
            { id: 2, name: 'Jorge Garcia' }
        ],
        nickname: [
            { id: 1, name: "Lardo", fk_actor_nickname_id: 2},
            { id: 2, name: "Pork Pie"},
            { id: 3, name: "Hoss"},
            { id: 4, name: "Rerun"},
            { id: 5, name: "Hammo"},
            { id: 6, name: "Snuffy"},
            { id: 7, name: "Montezuma"},
            { id: 8, name: "Freckles"},
            { id: 9, name: "Sheena"},
            { id: 10, name: "Thelma"},
            { id: 11, name: "Shortcake"},
            { id: 12, name: "Sweetcheeks"},
            { id: 13, name: "Puddin"}
        ],
        user: [
            { id: 1, name: "Administrator", username: "admin", password: "sha1$0fbd3e0d$1$b8caf7458c8eed89e836f9743273ac3a4d3df39d"}
        ],
        whitelist: [
               { id: 1, ipAddress: "::1", route: "*", method: "*"},
               { id: 2, ipAddress: "::ffff:127.0.0.1", route: "*", method: "*"}
        ]
};