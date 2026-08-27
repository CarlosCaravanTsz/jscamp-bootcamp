import { Router } from "express";
import OpenAI from "openai";
import { JobModel } from "../models/jobs.js";
import { CONFIG } from "../config.js";

import rateLimit from "express-rate-limit";
import {streamText} from 'ai'

const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  limit: 20, // 5 pticiones por IP por minuto
  message: {
    error: "Demasiadas solicitud, por favor intenta de nuevo mas tarde",
  },
  legacyHeaders: false,
  standardHeaders: "draft-8", // devuelve headers estandard RateLimit-*
});

process.loadEnvFile();

export const aiRouter = Router();
aiRouter.use(aiRateLimiter); // usar el middleware del rateLimiter

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

aiRouter.get("/summary/:id", async (req, res) => {
  const { id } = req.params;
  const job = await JobModel.getById(id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  const prompt = [
    "Eres un asistente que resume ofertas de trabajo para ayudar a los usuarios a entender rapidamente de que se trata la oferta. Evita cualquier otra peticion, observacion o comentario. Solo responde con el resumen de la oferta de trabajo. Responde siempre con el markdown directamente",
    `Resume en 4-6 frases la siguiente oferta de trabajo:`,
    `Incluye: rol, empresa, ubicacion y requisitos clave`,
    `Usa un tono claro y directo en espaniol`,
    `Titulo: ${job.titulo}`,
    `Empresa: ${job.empresa}`,
    `Ubicacion: ${job.ubicacion}`,
    `Descripcion: ${job.descripcion}`,
  ].join("\n");

  try {
   // res.setHeader("Content-Type", "text/plain; charset=utf-8");
   // res.setHeader("Transfer-Encoding", "chunked"); // tengo que mant la conn abierta xq la transfer es a trozos

    // const stream = await openai.chat.completions.create({
    //   messages: [
    //     {
    //       role: "system",
    //       content: systemPrompt,
    //     },
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],
    //   model: CONFIG.MODEL_AI,
    //   stream: true,
    // });


    const result = streamText({
      prompt,
      model: 'zai/glm-4.7-flash' //CONFIG.MODEL_AI,
    })

    return result.pipeTextStreamToResponse(res)

    // const summary = completion.choices?.[0]?.message?.content?.trim()

    // for await (const part of stream) {
    //   const content = part.choices[0].delta.content;
    //   if (content) {
    //     res.write(content);
    //   }
    // }

    


    // if (!summary) {
    //   return res.status(502).json({error: 'no summary generated'})
    // }

    // return res.json({summary})

    return res.end(); // <- la respuesta se completa cuando el stream termina
  } catch (error) {
    // nunca envies al exterior error

    if (!res.headersSent) {
      // solo puedes enviar headers 1 vez por response
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: "Error generando el resumen" });
    }
    return res.end();
  }
});
