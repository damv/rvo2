import { Vector2, vectorvector, RVOSimulator, abs, absSq, normalize } from '../lib/index';

// Juryleden letten op:
// - Emoties
// - Kijken in de zaal/meenemen met het verhaal
// - Tempo
// - Nadruk (stemgebruik, klemtoon, harder/zachter)
// - Verstaanbaarheid (uitspraak moet goed zijn)
// - Fragmentkeuze (leuk stukje uit het boek)
//
// Random selectie van leesvolgorde.
// Voorstellen van jezelf, en vertel iets over het boekje dat je gekozen hebt.

const v1 = new Vector2(-1, 2);
const v2 = new Vector2(1, 2);
const length = abs(v1);
console.log(length);
const vv = new vectorvector(2);
vv[0] = v1;
vv[1] = v2;

function setupScenario(sim: RVOSimulator, goals, nbrAgents: number) {
  sim.setTimeStep(0.25);
  sim.setAgentDefaults(15.0, 10, 10.0, 10.0, 1.5, 2.0);

  /*
   * Add agents, specifying their start position, and store their goals on the
   * opposite side of the environment.
   */
  for (var i = 0; i < nbrAgents; ++i) {
    const v = new Vector2(200 * Math.cos(i * 2.0 * Math.PI / nbrAgents), 200 * Math.sin(i * 2.0 * Math.PI / nbrAgents));
    sim.addAgent(v);
    goals[i] = new Vector2(-v.x(), -v.y());
  }

  // const a1 = sim.addAgent(v1, 2, 4, 5, 5, 2, 6, v1);
  // const a2 = sim.addAgent(v2, 2, 4, 5, 5, 2, 6, v1);
}

function setPreferredVelocity(sim, goals) {
  for (var i = 0; i < sim.getNumAgents(); i++) {
    const goal = goals[i];
    const pos = sim.getAgentPosition(i);
    var goalVector = new Vector2(goal.x() - pos.x(), goal.y() - pos.y());

    if (absSq(goalVector) > 1.0) {
      goalVector = normalize(goalVector);
    }

    sim.setAgentPrefVelocity(i, goalVector);
  }
}

function reachedGoal(sim, goals) {
  /* Check if all agents have reached their goals. */
  for (var i = 0; i < sim.getNumAgents(); ++i) {
    const goal = goals[i];
    const pos = sim.getAgentPosition(i);
    var dist = new Vector2(pos.x() - goal.x(), pos.y() - goal.y());
    if (absSq(dist) > sim.getAgentRadius(i) * sim.getAgentRadius(i)) {
      return false;
    }
  }
  return true;
}

function main() {
  const nbrAgents = 250;
  // const sim = new libRVO.RVOSimulator(0.25, 1, 4, 5, 5, 1.5, 7);
  const sim = new RVOSimulator();
  const goals = new vectorvector(nbrAgents);

  setupScenario(sim, goals, nbrAgents);

  // sim.addObstacle(vv);
  var i = 0;
  do {
    if (++i % 10 === 0) {
      console.log('TIME: ' + i);
    }
    setPreferredVelocity(sim, goals);
    sim.doStep();
    // for (var j = 0; j < sim.getNumAgents(); j++) {
    //   const p = sim.getAgentPosition(j);
    //   console.log(j + ': ' + 'x = ' + p.x() + ', y = ' + p.y());
    // }
  } while (!reachedGoal(sim, goals));

  console.log('Done');
}

main();