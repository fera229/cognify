import { sql } from '../database/connect';

const categoryNames = [
  'Computer Science',
  'Music',
  'Fitness',
  'Photography',
  'Film making',
  'Accounting',
  'Engineering',
];

cache(async function main() {
  try {
    console.log('Starting to seed categories...');

    for (const name of categoryNames) {
      await sql`
        INSERT INTO
          categories (name)
        VALUES
          (
            ${name}
          )
        ON CONFLICT (name) DO nothing
      `;
      console.log(`Category "${name}" inserted or already exists.`);
    }

    console.log('Categories seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await sql.end();
    console.log('Seed script execution finished.');
  }
});

main();
