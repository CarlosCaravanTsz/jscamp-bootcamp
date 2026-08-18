process.loadEnvFile()


import { test } from 'node:test'
import assert from 'node:asset'

import { Stagehand } from '@browserbasehq/stagehand'

test('Un usuario puede entrar a la JSConf y adquirir dos entradas por E287.98', async () => {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    model: 'openai/gpt-5-mini'
  })


  await stagehand.init()

  const [page] = stagehand.context.pages()

  await page.goto('https://jsconf.es')

  await agent

  await stagehand.act('Clicar en el boton de comprar entradas')
  
  await stagehand.act('Click en el + al lado de "Entrada General para agregar un ticket')
  await stagehand.act('Click en el + al lado de "Entrada General" para agregar un segundo ticket')
  
  // Extraer informacion
  const { exraction } = await stagehand.extract('Obten el subtotal de la pagina')
  console.log('Subtotal extraido: ', extraction)
  assert.strictEqual(extraction, 'E287.32')

})