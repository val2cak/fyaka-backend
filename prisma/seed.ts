import { db } from '../src/utils/db.server';

type User = {
  username: string;
  email: string;
  password: string;
};

type Service = {
  title: string;
  description: string;
  location: string;
  price: number;
  date: Date;
  people: number;
  categoryId: number;
};

async function seed() {
  await Promise.all(
    getUsers().map((user) => {
      return db.user.create({
        data: {
          username: user.username,
          email: user.email,
          password: user.password,
        },
      });
    })
  );
  const user = await db.user.findFirst({
    where: {
      username: 'username',
    },
  });

  await Promise.all(
    getServices().map((service) => {
      const { title, description, location, price, date, people, categoryId } =
        service;
      return db.service.create({
        data: {
          title,
          description,
          location,
          price,
          date,
          people,
          authorId: user?.id as number,
          categoryId,
        },
      });
    })
  );
}

seed();

function getUsers(): Array<User> {
  return [
    {
      username: 'username',
      email: 'email',
      password: 'password',
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
      categoryId: 1,
    },
  ];
}
