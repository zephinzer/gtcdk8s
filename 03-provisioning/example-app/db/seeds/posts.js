
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(function () {
      // Inserts seed entries
      return knex('posts').insert([
        {content: 'Lorem cillum amet elit aute pariatur aliquip. Quis excepteur Lorem duis magna dolore. Tempor minim elit occaecat minim pariatur proident non deserunt occaecat in.'},
        {content: 'Aliqua in exercitation cupidatat laboris eu est aliqua laboris. Et consequat id id ea do ipsum. Commodo amet do veniam non aliqua sint aliqua id commodo proident Lorem esse.'},
        {content: 'Mollit aliqua anim officia dolor in consectetur aliquip duis dolore laboris laboris. Nulla laborum mollit aliqua sit voluptate eiusmod est cupidatat duis exercitation dolore officia. Deserunt consectetur dolore sunt Lorem reprehenderit enim ea velit exercitation. Magna non irure minim eiusmod enim reprehenderit quis labore eu. Excepteur fugiat amet laborum pariatur ipsum. Esse dolor est fugiat duis amet do reprehenderit labore. Tempor cillum adipisicing ad consectetur amet labore ipsum do tempor velit aute irure.'},
        {content: 'Commodo elit tempor dolore eu ad ut ea. Proident mollit eu nulla laborum commodo. Nostrud sit ex sunt do enim nisi veniam incididunt est quis adipisicing ut ex. Dolore sit ad incididunt veniam labore magna. Aliqua ullamco eiusmod non esse irure mollit elit fugiat eu proident voluptate.'},
        {content: 'Voluptate incididunt officia mollit eu ipsum fugiat ipsum eiusmod dolor adipisicing. Minim officia velit qui amet amet. Ea deserunt irure do sit. Velit enim duis irure excepteur non ullamco et in in quis. In reprehenderit quis reprehenderit proident. Tempor pariatur dolore commodo velit.'},
      ]);
    });
};
