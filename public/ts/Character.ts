namespace model {
  export class Character {
    id: string;
    forename: string | null;
    surname: string;
    sexType: enums.SexType;
    intAge: number;
    private _fat: number;
    private _muscle: number;
    EquippedApparels: Map<enums.ApparelSlot, ts.Apparel[]>;

    // skill dari stats.tw -er
    // this is a straight conversion. will be revised by GM later
    private _adaptation: number = 0;
    private _charisma: number = 0;
    private _creativity= 0;
    private _durability: number = 0;
    private _financial_management: number = 0;
    private _health: number = 0; // ini bagusnya taruh di object baru namanya life_cost / ability -er
    private _initiative: number = 0;
    private _patience: number = 0;
    private _persistence: number = 0;
    private _popularity: number = 0;
    private _sensibility: number = 0;
    private _social_network: number = 0;
    private _technical_skills: number = 0;
    private _time_management: number = 0;
    private _thoroughness: number = 0;

    constructor(
      id: string = "",
      forename: string | null = null,
      surname: string = "",
      sexType: enums.SexType = enums.SexType.Masculine,
      intAge: number = 18,
      fat: number = 0,
      muscle: number = 0
    ) {
      this.id = id;
      this.forename = forename;
      this.surname = surname;
      this.sexType = sexType;
      this.intAge = intAge;
      this._fat = Math.min(Math.max(fat, 0), 6);
      this._muscle = Math.min(Math.max(muscle, 0), 6);
      this.EquippedApparels = new Map();
    }

    get fat(): number {
      return this._fat;
    }

    set fat(value: number) {
      this._fat = Math.min(Math.max(value, 0), 6);
    }

    get muscle(): number {
      return this._muscle;
    }

    set muscle(value: number) {
      this._muscle = Math.min(Math.max(value, 0), 6);
    }

    // prettier-ignore
    get physique(): string {
      const bodyTypes = [
        ["Emaciated", "Thin", "Lean", "Toned", "Defined", "Sculpted", "Ripped"],
        ["Gaunt", "Slender", "Slim", "Fit", "Taut", "Cut", "Shredded"],
        ["Underweight", "Svelte", "Lithe", "Athletic", "Muscular", "Built", "Solid"],
        ["Average", "Wiry", "Balanced", "Stocky", "Husky", "Buff", "Hefty"],
        ["Soft", "Slightly Firm", "Firm", "Bulky", "Strong", "Burly", "Massive"],
        ["Pudgy", "Chubby", "Stout", "Robust", "Thick", "Powerhouse", "Brawny"],
        ["Overweight", "Portly", "Heavyset", "Large", "Hulking", "Gargantuan", "Herculean"],
      ];
      return bodyTypes[Math.min(this.fat, 6)][Math.min(this.muscle, 6)];
    }

    get ageDescriptor(): string {
      if (this.intAge < 17) return "teenage";
      if (this.intAge < 21) return "grown-up";
      if (this.intAge < 24) return "early-twenties";
      if (this.intAge < 27) return "mid-twenties";
      if (this.intAge < 30) return "late-twenties";
      if (this.intAge < 34) return "early-thirties";
      if (this.intAge < 37) return "mid-thirties";
      if (this.intAge < 40) return "late-thirties";
      return "fuzzy-aged";
    }

    get sexToAgeDescriptor(): string {
      if (this.sexType === enums.SexType.Masculine) {
        return this.intAge <= 21 ? "Boy" : "Man";
      } else if (this.sexType === enums.SexType.Feminime) {
        return this.intAge <= 21 ? "Girl" : "Woman";
      }
      return "Hermaphrodite";
    }

    equipApparel(apparel: ts.Apparel): void {
      if (!this.EquippedApparels.has(apparel.apparelSlot)) {
        this.EquippedApparels.set(apparel.apparelSlot, []);
      }
      this.EquippedApparels.get(apparel.apparelSlot)!.push(apparel);
    }

    // prettier-ignore
    printCoveredBodyPart(): string {
      const coveredParts = new Set<enums.BodyCoverage>();
      this.EquippedApparels.forEach((apparels) =>
        apparels.forEach((apparel) =>
          apparel.bodyCoverages.forEach(coverage => coveredParts.add(coverage))
        )
      );
      return Array.from(coveredParts).join(", ");
    }

    // prettier-ignore
    getCoveredBodyPart(): enums.BodyCoverage[] {
      const coveredParts = new Set<enums.BodyCoverage>();
      this.EquippedApparels.forEach((apparels) =>
        apparels.forEach((apparel) =>
          apparel.bodyCoverages.forEach((coverage) => coveredParts.add(coverage))
        )
      );
      return Array.from(coveredParts);
    }

    getApparelsByApparelSlot(apparelSlot: enums.ApparelSlot): ts.Apparel[] {
      return this.EquippedApparels.get(apparelSlot) || [];
    }

    getApparels(): ts.Apparel[] {
      return Array.from(this.EquippedApparels.values()).flat();
    }

    describeCharacterInOneString(): string {
      return `A ${this.physique} ${this.ageDescriptor} ${this.sexToAgeDescriptor}`;
    }

    getCalling(): string {
      return this.forename ? `${this.forename} ${this.surname}` : this.surname;
    }

    writeIntoJSONFile(): void {
      const jsonString = JSON.stringify(this);
      console.log("Character JSON:", jsonString);
    }
  }
}