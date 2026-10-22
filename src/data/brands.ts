export const brands = [
  {
    slug: 'lentropiste',
    website: 'https://lentropiste.com/',
    instagram: 'https://www.instagram.com/lentropiste/',
    websiteLive: true,
    name: "L’Entropiste",
    category: 'Parfumerie de niche',
    status: 'Maison active · Paris',
    tagline: 'Une parfumerie libre, audacieuse et inattendue.',
    intro: 'L’Entropiste bouscule les conventions à travers des créations olfactives construites autour de contrastes, de matières et d’associations inattendues.',
    story: [
      'De Dorian’s Spleen, gourmand fumé aux accents de whisky, café et cendres, à Ensang Noir, Altamura, Blanc Sada, Dawn Whispers, Jodhpur 6am, Semence Douce et White Blood, chaque parfum affirme son propre caractère.',
      'Signées par le maître parfumeur Bertrand Duchaufour, les fragrances composent une maison contemporaine, expressive et sans compromis.'
    ],
    pillars: [
      ['Création', 'Des partis pris olfactifs singuliers, pensés comme des expériences à part entière.'],
      ['Matières', 'Une écriture construite autour du contraste, de la texture et de l’inattendu.'],
      ['Reconnaissance', 'Dorian’s Spleen, Prix du Meilleur Parfum de Niche de l’année, décerné par la Fragrance Foundation France en juin 2026.']
    ],
    tone: '#3d2822'
  },
  {
    slug: 'betenoir',
    website: 'https://betenoir.com/',
    instagram: null,
    websiteLive: true,
    name: 'Betenoir',
    // Copy condensed from the BETENOIR brand book 2026 (FR); non-breaking spaces keep French spacing before « : » and in « 37 ml ».
    category: 'Parfumerie de niche',
    status: 'Maison active · Paris',
    tagline: 'Le parfum comme une pièce de mode : avant-gardiste, décalé, sans masque.',
    intro: 'BETENOIR ne transforme rien. La maison s’adresse à ce qui existe déjà, avant le rôle que le monde impose.',
    story: [
      'BETENOIR emprunte à Jung l’idée de la Persona : ce masque social que chacun construit pour correspondre à ce que le monde attend. Sous ce masque persiste la part non éditée de chacun, celle qui existe avant d’être corrigée pour plaire. C’est elle que BETENOIR appelle la bête.',
      'Dans un paysage lissé, où tout le monde se ressemble, la vraie rareté n’est plus l’audace. C’est la présence. BETENOIR ne provoque pas. BETENOIR prend sa place.'
    ],
    // A pillar may hold [name, line] rows instead of a paragraph: the name in red, the line beneath it.
    pillars: [
      ['Cinq visages', [
        ['NO FILTER', 'Se révèle'],
        ['SOUVERAIN', 'Règne'],
        ['OFFLINE', 'Se retire'],
        ['DRAMA', 'Se met en scène'],
        ['NUIT BLANCHE', 'S’abandonne']
      ]],
      ['Les parfumeurs', [
        ['Vincent Ricord', 'SOUVERAIN · OFFLINE'],
        ['Bertrand Duchaufour', 'NO FILTER · NUIT BLANCHE'],
        ['Théo Monterosso', 'DRAMA']
      ]],
      ['L’objet', '37 ml et 73 ml, les chiffres porte-bonheur des deux fondateurs, en miroir. Un capot laqué noir, aimanté en double direction : un geste, pas un argument.']
    ],
    tone: '#171717'
  },
  {
    slug: 'sunlution',
    website: 'https://sunlutionskincare.com/',
    instagram: 'https://www.instagram.com/sunlution_skincare/',
    websiteLive: true,
    name: 'Sunlution',
    category: 'Cosmétique · Science',
    status: 'Light-conscious skincare',
    tagline: 'La science de la lumière au service de la longévité de la peau.',
    intro: 'SUNLUTION développe une nouvelle génération de soins quotidiens pour protéger et renforcer la peau face au photovieillissement et au stress oxydatif.',
    story: [
      'Fondée sur plus de vingt ans de recherche et portée par l’expertise du Professeur Thierry Passeron, dermatologue et chercheur, la marque développe une approche light-conscious de la beauté.',
      'De la photoprotection quotidienne aux soins régénérants, SUNLUTION construit un système complet qui repense les liens entre lumière, peau et vieillissement.'
    ],
    pillars: [
      ['Smart Shield', 'Aider la peau à mieux se défendre face aux différentes formes de lumière.'],
      ['Cellular Reset', 'Soutenir les mécanismes essentiels de récupération et de renouvellement.'],
      ['Structure Renew', 'Préserver la qualité, la densité et l’apparence de la peau dans le temps.']
    ],
    tone: '#9a6d32'
  },
  {
    slug: 'masqly',
    website: 'https://masqly.com/',
    instagram: 'https://www.instagram.com/masqly.paris/',
    websiteLive: true,
    name: 'Masqly',
    category: 'Body care · Rituals',
    status: 'Soin intensif',
    tagline: 'Le soin intensif des zones oubliées.',
    intro: 'MASQLY réinvente le masque cosmétique en l’étendant aux zones du corps qui révèlent le temps mais restent absentes des routines de soin.',
    story: [
      'Une première génération de masques anti-âge intensifs est dédiée aux mains et bras, ainsi qu’aux pieds et jambes, avec une gestuelle simple : enfiler, masser, laisser agir.',
      'Tremelle, Criste Marine, Acide Hyaluronique et Niacinamide sont réunis pour hydrater, lisser, repulper et raviver l’éclat.'
    ],
    pillars: [
      ['Ciblé', 'Des formats conçus pour les mains, les bras, les pieds, les jambes, les coudes et les genoux.'],
      ['Intensif', 'Des formules concentrées et une hydratation prolongée jusqu’à quarante-huit heures.'],
      ['Intuitif', 'Un rituel simple, sensoriel et immédiatement compréhensible.']
    ],
    tone: '#ab664e'
  }
] as const;
