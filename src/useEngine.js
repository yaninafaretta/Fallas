import { Engine } from 'json-rules-engine'

const useEngine = () => {
  // define a rule for detecting the player has exceeded foul limits.  Foul out any player who:
  // (has committed 5 fouls AND game is 40 minutes) OR (has committed 6 fouls AND game is 48 minutes)
  let engine = new Engine()
  engine.addRule({
    conditions: {
      any: [{
        all: [{
          fact: 'gameDuration',
          operator: 'equal',
          value: 40
        }, {
          fact: 'personalFoulCount',
          operator: 'greaterThanInclusive',
          value: 5
        }]
      }, {
        all: [{
          fact: 'gameDuration',
          operator: 'equal',
          value: 48
        }, {
          fact: 'personalFoulCount',
          operator: 'greaterThanInclusive',
          value: 6
        }]
      }]
    },
    event: {  // define the event to fire when the conditions evaluate truthy
      type: 'fouledOut',
      params: {
        message: 'Player has fouled out!'
      }
    }
  })

  /**
   * Define facts the engine will use to evaluate the conditions above.
   * Facts may also be loaded asynchronously at runtime; see the advanced example below
   */
  let facts = {
    personalFoulCount: 6,
    gameDuration: 40
  }

  return { engine, facts }
};

export default useEngine;
