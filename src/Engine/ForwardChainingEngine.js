class ForwardChainingEngine {
  constructor(rules) {
    this.rules = rules;
    this.facts = {};
  }

  _countEqualConditionsMatched(conditions) {
    let count = 0;
    conditions
      .filter((c) => !c.any)
      .forEach((condition) => {
        if (this.facts[condition.key] === condition.value) {
          count++;
        }
      });
    return count;
  }

  _countAnyConditionsMatched(conditions) {
    let count = 0;
    conditions
      .filter((c) => c.any)
      .map((c) => c.any)
      .forEach((condition) => {
        const values = this.facts[condition[0].key];
        const conditionvalues = condition.map((c) => c.value);
        if (values && values.some((v) => conditionvalues.includes(v))) {
          count++;
        }
      });
    return count;
  }

  _getSimilarity(rule) {
    let count = 0;
    count += this._countEqualConditionsMatched(rule.conditions);
    count += this._countAnyConditionsMatched(rule.conditions);
    return count;
  }

  _applicableRules() {
    return this.rules
      .map((rule) => ({
        rule: rule,
        conditionsMatched: this._getSimilarity(rule),
        recommendation: rule.action.recommendation,
      }))
      .filter((result) => result.conditionsMatched >= 3)
      .sort((a, b) => b.conditionsMatched - a.conditionsMatched);
  }

  run(initialFacts) {
    this.facts = { ...initialFacts };
    return this._applicableRules(initialFacts);
  }
}

export default ForwardChainingEngine;
