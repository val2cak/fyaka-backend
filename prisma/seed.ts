import { db } from '../src/utils/db.server';

type User = {
  firstName: string;
  lastName: string;
};

type Service = {
  title: string;
  description: string;
  location: string;
  price: number;
  date: Date;
  people: number;
};

async function seed() {
  await Promise.all(
    getUsers().map((user) => {
      return db.user.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    })
  );
  const user = await db.user.findFirst({
    where: {
      firstName: 'John',
    },
  });

  await Promise.all(
    getServices().map((service) => {
      const { title, description, location, price, date, people } = service;
      return db.service.create({
        data: {
          title,
          description,
          location,
          price,
          date,
          people,
          authorId: user.id,
        },
      });
    })
  );
}

seed();

function getUsers(): Array<User> {
  return [
    {
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      firstName: 'Mark',
      lastName: 'Doe',
    },
    {
      firstName: 'Ian',
      lastName: 'Doe',
    },
  ];
}

function getServices(): Array<Service> {
  return [
    {
      title: 'Service',
      description: 'Service',
      location: 'Split',
      price: 30,
      date: new Date(),
      people: 1,
    },
  ];
}
