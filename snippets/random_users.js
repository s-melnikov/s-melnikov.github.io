const FIRST_NAME_MALE = ["Олександр", "Олексій", "Анатолій", "Андрій", "Антон", "Аркадій", "Арсеній", "Артем", "Богдан", "Борис", "Вадим", "Валентин", "Валерій", "Василь", "Віктор", "Віталій", "Володимир", "Владислав", "В'ячеслав", "Георгій", "Гліб", "Григорій", "Давид", "Данило", "Денис", "Дмитро", "Євген", "Єгор", "Іван", "Ігор", "Ілля", "Кирило", "Костянтин", "Лев", "Максим", "Марк", "Матвій", "Михайло", "Микита", "Микола", "Олег", "Павло", "Петро", "Петро", "Роман", "Руслан", "Семен", "Сергій", "Степан", "Тимофій", "Федір", "Юрій", "Ярослав"];
const FIRST_NAME_FEMALE = ["Олександра", "Аліна", "Аліса", "Алла", "Альбіна", "Анастасія", "Ангеліна", "Анжеліка", "Анна", "Богдана", "Валентина", "Валерія", "Варвара", "Василиса", "Віра", "Вероніка", "Вікторія", "Віолетта", "Віталія", "Влада", "Владислава", "Галина", "Дарина", "Єва", "Євгенія", "Катерина", "Елен", "Олена", "Єлизавета", "Жанна", "Інна", "Ірина", "Христина", "Ксенія", "Лариса", "Лера", "Лілія", "Любов", "Людмила", "Маргарита", "Марина", "Марія", "Мирослава", "Надія", "Наталія", "Оксана", "Олеся", "Ольга", "Павла", "Поліна", "Руслана", "Світлана", "Соня", "Софія", "Таїсія", "Тамара", "Тетяна", "Уляна", "Емілія", "Юлія", "Яна", "Ярослава"];
const LAST_NAMES =  ["Іванов", "Петров", "Сидоров", "Черевко", "Андріяшев", "Бабич", "Балюк", "Вдовенко", "Герасименко", "Горовенко", "Дашкевич", "Жданович", "Калиненко", "Колотило", "Кузик", "Лойко", "Мичко", "Пістун", "Романович", "Сергієнко", "Стрижак", "Холостенко", "Шимко", "Яримович", "Бондаренко", "Броварук", "Винниченко", "Гончаренко", "Грабаренко", "Ковальський", "Колісник", "Млинарчук", "Олійниченко", "Теслярук"];
const DEPARTMENT = ["контролю", "реалізації", "постачання"];
const OCCUPATION = ["аудитор", "менеджер", "начальник", "інспектор", "старший фахівець", "фахівець", "секретар"];

const downloadFile = (content, filename) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([content], { type: "plain/text" }),
  );
  a.download = filename;
  a.click();
};
const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const getRandomIndex = (length) => getRandom(0, length - 1);
const getRandomDigit = () => getRandom(0, 9);
const getDigitSeq = (length) => [...new Array(length)].map(() => getRandomDigit()).join("");
const getRandItem = (array) => array[getRandomIndex(array.length)];

const result = [["Табельний номер", "Призвіще", "По батькові", "Ім'я", "Відділ", "Посада", "Дата прийому на роботу", "Ставка"]];
const dateTo = Date.now();
const dateFrom = dateTo - 5 * 365 * 24 * 60 * 60 * 1000;

for (let i = 0; i < 1000; i++) {
  const sex = Math.random() > 0.5;
  const firstName = getRandItem(sex ? FIRST_NAME_MALE : FIRST_NAME_FEMALE);
  const secondName = getRandItem(FIRST_NAME_MALE);
  result.push([
    getDigitSeq(6),
    firstName,
    getRandItem(LAST_NAMES),
    `${secondName.replace(/\[о]$/, "")}${sex ? "ович" : "івна"}`,
    getRandItem(DEPARTMENT),
    getRandItem(OCCUPATION),
    new Date(getRandom(dateFrom, dateTo)).toLocaleDateString(),
    getRandom(1, 4) / 2,
  ]);
}

downloadFile(
  result.map((r) => r.join(", ")).join("\n"), 
  "dump.csv",
);