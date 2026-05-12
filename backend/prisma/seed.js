
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const usuario = await prisma.usuario.upsert({

    where: { email: 'facundo@test.com' },

    update: {},

    create: {

      nombre: 'Facundo Test',

      email: 'facundo@test.com',

      password: 'password123', // En producción usar bcrypt

      vehiculos: {

        create: {

          matricula: '1234ABC',

          marca: 'Seat',

          modelo: 'Ibiza',

          anio: 2020,

          kilometraje: 50000

        }

      }

    },

  });

  console.log('Usuario y vehículo de prueba creados:', usuario);

}

main()

  .catch((e) => { console.error(e); process.exit(1); })

  .finally(async () => { await prisma.$disconnect(); });




