import { Bench, Task } from "tinybench"
import {
  generateNoirProof,
  verifyNoirProof,
  SemaphoreNoirProof
} from "@semaphore-protocol/proof"
import * as V4 from "@semaphore-protocol/core"

const generateTable = (task: Task) => {
  if (task && task.name && task.result) {
    return {
      Function: task.name,
      "ops/sec": task.result.error
        ? "NaN"
        : parseInt(task.result.hz.toString(), 10).toLocaleString(),
      "Average Time (ms)": task.result.error
        ? "NaN"
        : task.result.mean.toFixed(5),
      Samples: task.result.error ? "NaN" : task.result.samples.length
    }
  }
}

async function main() {
  //   const samples = 100

  //   const bench = new Bench({ time: 0, iterations: samples })

  const bench = new Bench()

  const generateMembersV4 = (size: number) => {
    return Array.from(
      { length: size },
      (_, i) => new V4.Identity(i.toString())
    ).map(({ commitment }) => commitment)
  }

  let memberV4: V4.Identity

  let groupV4: V4.Group

  let membersV4: bigint[]

  let proofV4: SemaphoreNoirProof

  bench
    .add(
      "V4 - Verify Proof 1 Member",
      async () => {
        await verifyNoirProof(proofV4, "./compiled_noir_circuit/semaphore-noir-16.json")
      },
      {
        beforeAll: async () => {
          groupV4 = new V4.Group([])
          memberV4 = new V4.Identity()
          groupV4.addMember(memberV4.commitment)
          proofV4 = await generateNoirProof(memberV4, groupV4, 1, 1, 16, "./compiled_noir_circuit/semaphore-noir-16.json")
        }
      }
    )
    .add(
      "V4 - Verify Proof 100 Members",
      async () => {
        await verifyNoirProof(proofV4, "./compiled_noir_circuit/semaphore-noir-16.json")
      },
      {
        beforeAll: async () => {
          membersV4 = generateMembersV4(100)
          groupV4 = new V4.Group(membersV4)
          const index = Math.floor(membersV4.length / 2)
          memberV4 = new V4.Identity(index.toString())
          proofV4 = await generateNoirProof(memberV4, groupV4, 1, 1, 16, "./compiled_noir_circuit/semaphore-noir-16.json")
        }
      }
    )
    .add(
      "V4 - Verify Proof 500 Members",
      async () => {
        await verifyNoirProof(proofV4, "./compiled_noir_circuit/semaphore-noir-16.json")
      },
      {
        beforeAll: async () => {
          membersV4 = generateMembersV4(500)
          groupV4 = new V4.Group(membersV4)
          const index = Math.floor(membersV4.length / 2)
          memberV4 = new V4.Identity(index.toString())
          proofV4 = await generateNoirProof(memberV4, groupV4, 1, 1, 16, "./compiled_noir_circuit/semaphore-noir-16.json")
        }
      }
    )
    .add(
      "V4 - Verify Proof 1000 Members",
      async () => {
        await verifyNoirProof(proofV4, "./compiled_noir_circuit/semaphore-noir-16.json")
      },
      {
        beforeAll: async () => {
          membersV4 = generateMembersV4(1000)
          groupV4 = new V4.Group(membersV4)
          const index = Math.floor(membersV4.length / 2)
          memberV4 = new V4.Identity(index.toString())
          proofV4 = await generateNoirProof(memberV4, groupV4, 1, 1, 16, "./compiled_noir_circuit/semaphore-noir-16.json")
        }
      }
    )
    .add(
      "V4 - Verify Proof 2000 Members",
      async () => {
        await verifyNoirProof(proofV4, "./compiled_noir_circuit/semaphore-noir-16.json")
      },
      {
        beforeAll: async () => {
          membersV4 = generateMembersV4(2000)
          groupV4 = new V4.Group(membersV4)
          const index = Math.floor(membersV4.length / 2)
          memberV4 = new V4.Identity(index.toString())
          proofV4 = await generateNoirProof(memberV4, groupV4, 1, 1, 16, "./compiled_noir_circuit/semaphore-noir-16.json")
        }
      }
    )

  await bench.warmup()
  await bench.run()

  const table = bench.table((task) => generateTable(task))

  console.table(table)

  // console.log(bench.results)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
