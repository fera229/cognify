--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Homebrew)
-- Dumped by pg_dump version 16.4 (Homebrew)

-- Started on 2025-01-05 15:11:54 CET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS lms;
--
-- TOC entry 3862 (class 1262 OID 16391)
-- Name: lms; Type: DATABASE; Schema: -; Owner: wesamnrr
--

CREATE DATABASE lms WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';


ALTER DATABASE lms OWNER TO wesamnrr;

\connect lms

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16393)
-- Name: lms; Type: SCHEMA; Schema: -; Owner: lms
--

CREATE SCHEMA lms;


ALTER SCHEMA lms OWNER TO lms;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 235 (class 1259 OID 20820)
-- Name: attachments; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.attachments (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    url text NOT NULL,
    course_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE lms.attachments OWNER TO lms;

--
-- TOC entry 234 (class 1259 OID 20819)
-- Name: attachments_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.attachments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 20677)
-- Name: categories; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE lms.categories OWNER TO lms;

--
-- TOC entry 220 (class 1259 OID 20676)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 20794)
-- Name: course_media; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.course_media (
    id integer NOT NULL,
    course_id integer,
    media_type character varying(50) NOT NULL,
    media_url character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE lms.course_media OWNER TO lms;

--
-- TOC entry 230 (class 1259 OID 20793)
-- Name: course_media_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.course_media ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.course_media_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 20685)
-- Name: courses; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.courses (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    image_url text,
    description text,
    instructor_id integer,
    price numeric(10,2),
    is_published boolean DEFAULT false,
    category_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_course_id CHECK ((id > 0))
);


ALTER TABLE lms.courses OWNER TO lms;

--
-- TOC entry 222 (class 1259 OID 20684)
-- Name: courses_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.courses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.courses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 243 (class 1259 OID 20894)
-- Name: enrollments; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.enrollments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    is_paid boolean DEFAULT false NOT NULL,
    enrollment_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE lms.enrollments OWNER TO lms;

--
-- TOC entry 242 (class 1259 OID 20893)
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.enrollments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.enrollments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 20729)
-- Name: lessons; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.lessons (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    "position" integer NOT NULL,
    module_id integer NOT NULL,
    is_published boolean DEFAULT false,
    is_free boolean DEFAULT false,
    video_url text,
    duration integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_duration CHECK (((duration IS NULL) OR (duration >= 0))),
    CONSTRAINT positive_lesson_id CHECK ((id > 0)),
    CONSTRAINT positive_lesson_position CHECK (("position" >= 0))
);


ALTER TABLE lms.lessons OWNER TO lms;

--
-- TOC entry 226 (class 1259 OID 20728)
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.lessons ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.lessons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 217 (class 1259 OID 16727)
-- Name: migrations; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE lms.migrations OWNER TO lms;

--
-- TOC entry 216 (class 1259 OID 16726)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

CREATE SEQUENCE lms.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE lms.migrations_id_seq OWNER TO lms;

--
-- TOC entry 3864 (class 0 OID 0)
-- Dependencies: 216
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: lms; Owner: lms
--

ALTER SEQUENCE lms.migrations_id_seq OWNED BY lms.migrations.id;


--
-- TOC entry 225 (class 1259 OID 20708)
-- Name: modules; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.modules (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    "position" integer NOT NULL,
    course_id integer NOT NULL,
    is_published boolean DEFAULT false,
    is_free boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_module_id CHECK ((id > 0)),
    CONSTRAINT positive_module_position CHECK (("position" >= 0))
);


ALTER TABLE lms.modules OWNER TO lms;

--
-- TOC entry 224 (class 1259 OID 20707)
-- Name: modules_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.modules ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.modules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 237 (class 1259 OID 20836)
-- Name: mux_data; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.mux_data (
    id integer NOT NULL,
    lesson_id integer NOT NULL,
    asset_id text NOT NULL,
    playback_id text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE lms.mux_data OWNER TO lms;

--
-- TOC entry 236 (class 1259 OID 20835)
-- Name: mux_data_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.mux_data ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.mux_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 20806)
-- Name: sessions; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.sessions (
    id integer NOT NULL,
    token character varying(150) NOT NULL,
    expiry_timestamp timestamp without time zone DEFAULT (now() + '1 day'::interval) NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE lms.sessions OWNER TO lms;

--
-- TOC entry 232 (class 1259 OID 20805)
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.sessions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 239 (class 1259 OID 20854)
-- Name: stripe_customers; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.stripe_customers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    stripe_customer_id text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE lms.stripe_customers OWNER TO lms;

--
-- TOC entry 238 (class 1259 OID 20853)
-- Name: stripe_customers_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.stripe_customers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.stripe_customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 20770)
-- Name: user_progress; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.user_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    lesson_id integer NOT NULL,
    is_completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE lms.user_progress OWNER TO lms;

--
-- TOC entry 228 (class 1259 OID 20769)
-- Name: user_progress_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.user_progress ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.user_progress_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 219 (class 1259 OID 20665)
-- Name: users; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE lms.users OWNER TO lms;

--
-- TOC entry 218 (class 1259 OID 20664)
-- Name: users_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 241 (class 1259 OID 20875)
-- Name: video_transcripts; Type: TABLE; Schema: lms; Owner: lms
--

CREATE TABLE lms.video_transcripts (
    id integer NOT NULL,
    lesson_id integer NOT NULL,
    transcript_segments jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE lms.video_transcripts OWNER TO lms;

--
-- TOC entry 240 (class 1259 OID 20874)
-- Name: video_transcripts_id_seq; Type: SEQUENCE; Schema: lms; Owner: lms
--

ALTER TABLE lms.video_transcripts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME lms.video_transcripts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3577 (class 2604 OID 16730)
-- Name: migrations id; Type: DEFAULT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.migrations ALTER COLUMN id SET DEFAULT nextval('lms.migrations_id_seq'::regclass);


--
-- TOC entry 3848 (class 0 OID 20820)
-- Dependencies: 235
-- Data for Name: attachments; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.attachments (id, name, url, course_id, created_at, updated_at) FROM stdin;
1	Natural language....	https://utfs.io/f/8Uf4sEpUuxiPMNoS0w4HLXHBFEU0dCTcyx2WJ4oiVKzGeu3v	2	2024-11-15 12:51:31.567293+00	2024-11-15 12:51:31.567293+00
2	book 2	https://utfs.io/f/8Uf4sEpUuxiP00gHqB7nYQ5gIRh1sqNzK9oDemFwGictju0X	2	2024-11-15 12:52:56.739223+00	2024-11-15 12:52:56.739223+00
3	attachment 1	https://utfs.io/f/8Uf4sEpUuxiPrchjfjeamQ9fdnSwPeoTRDZHBW7j6i1O8F0X	3	2024-11-15 14:01:55.41856+00	2024-11-15 14:01:55.41856+00
4	att1	https://utfs.io/f/8Uf4sEpUuxiPcxv4p1OpI4od18rtWxXnFOsUG0u9JBDyN5iq	4	2024-11-15 18:15:13.138288+00	2024-11-15 18:15:13.138288+00
5	att 1	https://utfs.io/f/8Uf4sEpUuxiP8IMzsypUuxiPMcOB9n63aNSXqHTG4Rvebz0g	5	2024-11-18 14:42:51.54592+00	2024-11-18 14:42:51.54592+00
6	Superintelligence_Paths,Dangers,Strategies	https://utfs.io/f/8Uf4sEpUuxiP9i9vnTWdPJf4lkHtuIcyanBiqNSOv26FQZzg	6	2024-11-18 15:27:50.128849+00	2024-11-18 15:27:50.128849+00
8	att1	https://utfs.io/f/8Uf4sEpUuxiPVZFSGT5NF7HBOqosKtYRvTxZ6bUr1aILpem4	8	2024-11-21 11:23:04.740846+00	2024-11-21 11:23:04.740846+00
9	Atta1	https://utfs.io/f/8Uf4sEpUuxiPZoBqn7RhxJ7LcHXQyzRp1u3mIT09o6VbFwME	11	2024-11-21 22:03:38.851124+00	2024-11-21 22:03:38.851124+00
10	123	https://utfs.io/f/8Uf4sEpUuxiP7azWPJUYY4XBqDF8RZz3kUTwe9mHEu16jyLa	15	2024-11-21 23:53:13.541625+00	2024-11-21 23:53:13.541625+00
11	book 1	https://utfs.io/f/8Uf4sEpUuxiPVmRhLqJ5NF7HBOqosKtYRvTxZ6bUr1aILpem	17	2024-11-22 23:32:03.101927+00	2024-11-22 23:32:03.101927+00
12	yxy	https://utfs.io/f/8Uf4sEpUuxiPyFfmhyUktuOwXz2E9al7viU50CebTHMJ1jZp	18	2024-11-24 22:56:42.775133+00	2024-11-24 22:56:42.775133+00
13	pdf	https://utfs.io/f/8Uf4sEpUuxiPHjNSFJ2McOhiqmNDz6ju5lpI4nKVRB2FbSf9	21	2024-11-25 13:49:45.711555+00	2024-11-25 13:49:45.711555+00
15	Learn_Python.pdf	https://utfs.io/f/8Uf4sEpUuxiP5tB9Ocjn2TNt9pQfCKS0byoAajmuFYZzGHrk	23	2024-12-03 03:41:50.900326+00	2024-12-03 03:41:50.900326+00
\.


--
-- TOC entry 3834 (class 0 OID 20677)
-- Dependencies: 221
-- Data for Name: categories; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.categories (id, name) FROM stdin;
1	Programming
2	Data Science
3	Design
4	Marketing
5	Business
6	Personal Development
7	Photography
8	Music
9	Health & Fitness
10	Language Learning
11	Computer Science
12	Engineering
\.


--
-- TOC entry 3844 (class 0 OID 20794)
-- Dependencies: 231
-- Data for Name: course_media; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.course_media (id, course_id, media_type, media_url, created_at) FROM stdin;
\.


--
-- TOC entry 3836 (class 0 OID 20685)
-- Dependencies: 223
-- Data for Name: courses; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.courses (id, title, image_url, description, instructor_id, price, is_published, category_id, created_at, updated_at) FROM stdin;
2	Introduction to TypeScript	https://utfs.io/f/8Uf4sEpUuxiPhMvl4LsPciuGUVSgbwZY5EaxFC6NzA0JWnd8	<p>123</p><p></p>	1	89.99	f	11	2024-11-15 12:32:42.323766+00	2024-11-19 21:58:01.280223+00
5	Intro to sculpting	https://utfs.io/f/8Uf4sEpUuxiPOpaKI00BtncIz8LlYQqhoAgf1sCaxDbW3Xud	<p>Test description</p>	3	19.99	t	3	2024-11-18 14:39:26.883575+00	2024-11-18 14:47:10.299451+00
6	Introduction to TypeScript	https://utfs.io/f/8Uf4sEpUuxiPzp6AFenswdpaJ06bVSOyMNheYfoZg2HqQLmn	<p>This is a description</p>	4	19.99	f	11	2024-11-18 15:24:01.527225+00	2024-11-18 15:24:01.527225+00
1	Master python in 3 days	https://utfs.io/f/8Uf4sEpUuxiPCO79dxGBdqzeNmYw5bZ7Ai8hy60cxfSlgRW1	<p>In this course, you'll learn python in less than 3 days.</p>	1	19.99	t	11	2024-11-14 22:05:50.500622+00	2024-11-16 14:59:07.738133+00
21	Introduction to TypeScript	https://utfs.io/f/8Uf4sEpUuxiPVqMmKH5NF7HBOqosKtYRvTxZ6bUr1aILpem4	description	15	19.99	f	11	2024-11-25 13:47:57.755414+00	2024-11-25 20:53:07.300854+00
18	404: Work-Life Balance Not Found	https://utfs.io/f/8Uf4sEpUuxiPVgeEaM5NF7HBOqosKtYRvTxZ6bUr1aILpem4	,	9	19.99	t	9	2024-11-22 00:11:50.471103+00	2024-11-24 22:49:33.845416+00
13	The Art of Procaffeination: Advanced Coffee Break Studies	https://utfs.io/f/8Uf4sEpUuxiPS9DOBTMWLUuS1DgCE5H6oAsXYczj90ItJknm	asdf	9	0.99	t	2	2024-11-21 23:09:16.09992+00	2024-11-21 23:57:49.019276+00
4	Cooking 101	https://utfs.io/f/8Uf4sEpUuxiPp1eVa0g6mtiuDfpPTcR0e3SyqaQ7v18kjUsz	<p>In this comprehensive course, you'll learn how to cook eggs with chef dunno hau.</p>	2	89.99	t	10	2024-11-15 18:12:36.688022+00	2024-11-15 18:21:35.6929+00
12	Bug Life	https://utfs.io/f/8Uf4sEpUuxiPUq0t0LCz7nlFKprHdLg2iNvRjoXsb0aJyUV4	xcxc	9	84.99	t	11	2024-11-21 22:33:20.024536+00	2024-11-21 23:57:55.508293+00
7	Mediterranean cuisine	https://utfs.io/f/8Uf4sEpUuxiPbDkkAzTCyxAenosIQ0BFT9mfgabN43KvkDhL	<p>fgfg</p>	3	19.99	t	9	2024-11-20 20:04:04.077179+00	2024-11-21 10:58:57.243193+00
14	Git Push Yourself: Exercise for Developers	https://utfs.io/f/8Uf4sEpUuxiPb5GNgkTCyxAenosIQ0BFT9mfgabN43KvkDhL	asdf	9	499.99	t	11	2024-11-21 23:39:18.197857+00	2024-11-21 23:44:26.3441+00
3	Introduction to Architecture	https://utfs.io/f/8Uf4sEpUuxiPPRQeAwSKf3gapu6XvxjDQNbdAhnHEYwV9qrM	<p><span style="font-family: ui-monospace">After finishing this course, you'll become much better at pretending that you know what you're talking about when you’re talking about architecture</span></p>	1	65.99	t	12	2024-11-15 13:58:50.396782+00	2024-11-19 21:30:26.10055+00
8	Intro to TypeScript	https://utfs.io/f/8Uf4sEpUuxiPGjjKwTqVpXrlO9TYyn7HiszL2xvQogVBthAu	<p>test description</p>	5	19.99	f	11	2024-11-21 11:20:34.380368+00	2024-11-21 14:03:44.437259+00
9	Intro to TypeScript	\N	<p>Discr</p>	6	\N	f	\N	2024-11-21 14:11:57.909259+00	2024-11-21 14:11:57.909259+00
10	Introduction to TypeScript	https://utfs.io/f/8Uf4sEpUuxiPIq4S4KzAkoveqLSmYUOuZGnspx5c9r8tHDFh	<p>Test description</p>	7	19.99	f	\N	2024-11-21 18:43:06.546891+00	2024-11-21 18:43:06.546891+00
15	Quantum Procrastination: The Science of Doing It Later	https://utfs.io/f/8Uf4sEpUuxiPq35OZGAnGPF2pdbjDLMt03ZSHYWQAyl8O9v6	fgfg	9	23.99	t	2	2024-11-21 23:52:03.658949+00	2024-11-22 23:36:15.338161+00
11	Introduction to TypeScript	https://utfs.io/f/8Uf4sEpUuxiP1ofxhQq5ZJsrguSKYv4GCd9LDjVyHi8pzXmN	<p>Disc</p>	8	28.99	f	11	2024-11-21 22:02:03.587936+00	2024-11-21 22:19:09.15576+00
16	Rubber Duck Debugging: Professional Quackery 101	https://utfs.io/f/8Uf4sEpUuxiPq5jIP0AnGPF2pdbjDLMt03ZSHYWQAyl8O9v6	dsfrer	9	29.99	t	9	2024-11-22 00:02:43.065745+00	2025-01-05 12:03:45.615847+00
24	Intro to TypeScript	https://utfs.io/f/8Uf4sEpUuxiPAL6L3fEh5TFulPCIfkN49GEpZKjWzJDyrY3g	Learn TS fast with this comprehenive course	18	99.99	f	11	2024-12-03 04:30:31.152801+00	2024-12-23 10:38:29.488287+00
23	Introduction To Python	https://utfs.io/f/8Uf4sEpUuxiPq9KNsOMAnGPF2pdbjDLMt03ZSHYWQAyl8O9v	This beginner-friendly course covers the fundamentals of Python programming, including variables, data types, control structures, functions, and basic file handling. Ideal for those new to coding, it provides a strong foundation to start building real-world applications and exploring advanced topics like data analysis or web development.	9	84.99	f	11	2024-12-03 03:28:31.779701+00	2025-01-04 15:51:55.630221+00
17	Stack Overflow & Under: The Art of Copy-Paste Engineering	https://utfs.io/f/8Uf4sEpUuxiPG19i0lVpXrlO9TYyn7HiszL2xvQogVBthAuw	"Stack Overflow & Under: The Art of Copy-Paste Engineering" is a tongue-in-cheek yet practical course that transforms the common practice of code copying into a professional skill. Learn how to effectively research, understand, adapt, and properly credit code from online sources while developing better programming habits. Perfect for developers who want to turn their copy-paste habits into legitimate research and implementation skills.\n	9	12.00	f	3	2024-11-22 00:05:55.356327+00	2025-01-05 11:54:35.164539+00
\.


--
-- TOC entry 3856 (class 0 OID 20894)
-- Dependencies: 243
-- Data for Name: enrollments; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.enrollments (id, user_id, course_id, is_paid, enrollment_date) FROM stdin;
1	9	18	f	2024-12-01 16:02:48.661477+00
2	9	4	f	2024-12-01 16:13:23.309246+00
4	9	7	f	2024-12-01 16:15:52.089183+00
5	9	16	f	2024-12-01 16:20:51.5066+00
8	9	5	f	2024-12-01 18:28:15.783093+00
9	10	17	f	2024-12-01 18:30:14.115192+00
10	10	18	f	2024-12-01 18:31:36.223207+00
12	10	4	f	2024-12-01 18:42:54.903425+00
14	10	16	f	2024-12-01 18:43:11.789234+00
16	9	17	f	2024-12-01 19:05:54.498687+00
18	9	1	f	2024-12-01 19:11:25.32862+00
23	5	17	f	2024-12-01 19:19:33.234197+00
29	5	16	f	2024-12-01 20:09:55.367529+00
33	5	18	f	2024-12-01 20:22:42.822311+00
38	5	15	f	2024-12-01 20:43:30.86212+00
39	5	13	f	2024-12-01 20:43:55.48126+00
43	5	14	f	2024-12-01 21:10:59.429384+00
44	5	3	f	2024-12-01 21:20:36.420421+00
47	17	18	f	2024-12-01 22:30:43.055819+00
48	17	17	f	2024-12-01 22:31:30.186244+00
49	17	16	f	2024-12-01 22:33:59.85275+00
50	17	15	f	2024-12-01 22:38:56.736466+00
51	17	14	f	2024-12-01 22:40:47.640769+00
52	16	18	f	2024-12-01 22:43:01.55912+00
53	16	17	f	2024-12-01 23:24:35.852313+00
54	16	16	f	2024-12-01 23:27:37.160584+00
55	9	13	f	2024-12-01 23:30:39.102266+00
58	1	18	f	2024-12-02 07:46:12.974115+00
59	18	18	f	2024-12-03 04:29:19.496397+00
60	9	14	f	2024-12-05 16:05:26.421115+00
61	3	18	f	2025-01-05 12:06:07.359285+00
\.


--
-- TOC entry 3840 (class 0 OID 20729)
-- Dependencies: 227
-- Data for Name: lessons; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.lessons (id, title, description, "position", module_id, is_published, is_free, video_url, duration, created_at, updated_at) FROM stdin;
3	Intro	Intro to the course	0	1	f	t	\N	\N	2024-11-15 12:07:57.541534+00	2024-11-15 12:08:05.109536+00
2	lesson 2	Lesson 2 description 	2	1	f	f	\N	\N	2024-11-15 12:07:39.03917+00	2024-11-15 12:08:05.112745+00
25	"I Found This Solution Online" - A Developer's Love Story	Desc	1	33	t	f	vlxmcays017GYBxZi01022nwjFVNUbSs6k8Z701DHr5S3XQ	\N	2024-11-22 20:02:04.251397+00	2024-11-22 23:21:53.747056+00
18	L1	<p>lökdslsk</p>	0	19	t	f	t3NhjosZ1XW3BBCCb401ZuzPz9GB6GztTkHId7Ss5y74	\N	2024-11-21 23:10:10.349921+00	2024-11-21 23:13:35.828036+00
4	L1	D1\n	0	2	t	f	MNalIJyej00AV1JWpHhhoY7ppSDgF01IYZwbEhzDXhfuY	\N	2024-11-15 12:40:48.735333+00	2024-11-15 12:42:51.462912+00
33	Lesson 1	l1d	0	43	t	t	gNGh4L93IB9IeKzRejgDg3ttOPKc6r8HVVdtpVyz2LA	0	2024-11-25 13:52:08.561249+00	2024-11-25 13:52:50.46612+00
24	Video by deconjpa: pexels.com	l	0	34	t	f	TdBG4CKAjJ1x84ukVO00Ig01RFGSlKoOnD02iThJ7tZqM8	\N	2024-11-22 00:14:42.275301+00	2024-11-23 15:22:20.859623+00
22	ew	ew	0	31	t	f	R01KY00BaPsfH6602cBtSO9nX651JZCU02WVw78jkLhDLMg	\N	2024-11-22 00:03:58.819832+00	2024-11-23 20:21:12.474105+00
6	L1	jbfuganq	0	4	t	f	Cs3DQ8vMpCzZO3duYa6I4R00xq5vh7k00Mk6ESeNpaZMU	\N	2024-11-15 18:17:55.463053+00	2024-11-15 18:20:16.090363+00
7	l1	ld1	1	6	f	f	\N	\N	2024-11-18 14:43:51.196884+00	2024-11-18 14:44:08.359264+00
19	kjh	jmgb	0	23	t	t	iriN3WRO301qOZw3o1cmMtwd01101Qp6EVu2lVT6L01oUkM	\N	2024-11-21 23:42:41.309131+00	2024-11-21 23:43:53.99572+00
8	intro	ld1	0	6	t	t	1I2qwz00mrW5ClMIp7nzXk5M1pIYVDES014yMEcX6yrmk	\N	2024-11-18 14:44:01.971458+00	2024-11-18 14:45:58.378943+00
34	lesson 2	l2d	1	43	f	f	\N	\N	2024-11-25 20:51:56.850387+00	2024-11-25 20:51:56.850387+00
10	Lesson 2	Lesson 2 description	1	11	f	f	\N	\N	2024-11-19 14:00:18.216187+00	2024-11-19 14:00:18.216187+00
23	Understanding the Ctrl+C Ctrl+V Pipeline	Lesson 1 description	0	33	t	t	537WC5Nnu7kmzThWTxtA1CyLw02XFZQT5EjEvKcFxBbE	0	2024-11-22 00:09:35.358046+00	2024-11-24 22:03:42.422634+00
21	r	r	1	26	f	f	\N	\N	2024-11-21 23:53:53.815511+00	2024-11-21 23:53:53.815511+00
9	Lesson 1	Lesson 1 description	0	11	t	t	LHzFB016hwDSThCesMPc7MTB9C02nuxgSL5qRN02vcwNbk	\N	2024-11-19 14:00:06.642738+00	2024-11-19 14:27:27.862389+00
11	Lesson 1	Lesson 1 des	0	5	t	t	xSdIoLSRLT01EjB78JSLpv2MMUNnQ1X1lbwIrHlzQgdE	\N	2024-11-20 14:02:33.328575+00	2024-11-20 14:03:26.001217+00
13	lesson 2	lesson 1 d	1	13	f	f	\N	\N	2024-11-20 20:05:43.207123+00	2024-11-20 20:05:57.913144+00
20	r	r	0	26	t	f	GpMa293O62xTGllasfIg005qxsNGYQgm023uYVMuv1BW8	\N	2024-11-21 23:53:46.717065+00	2024-11-21 23:54:47.012117+00
12	lesson 1	lesson 1 d	0	13	t	f	Bo2Tk31JoAOtzFwxoRFD2DdJipG7PVOct1RYnXJD1OE	\N	2024-11-20 20:05:31.597468+00	2024-11-20 20:07:49.20433+00
14	Lesson 1	des	1	15	f	t	\N	\N	2024-11-21 11:25:05.074795+00	2024-11-21 11:25:22.016737+00
15	Lesson 2	des	0	15	t	t	6IJr01K9C83F3JBcgztDmFXZqWeIf7qq6SFpqHTGtb00g	\N	2024-11-21 11:25:12.538948+00	2024-11-21 11:26:31.699868+00
16	Lesson 1	asdf	0	17	t	f	Epns8m6Deqtpkx16Jsg901NbeaxzalqiduupjVmqJOgM	\N	2024-11-21 22:05:01.797761+00	2024-11-21 22:06:38.949713+00
26	Lesson 1	Lesson 1 description	0	37	t	f	vJ3pJt008xf5Uvwr55JQH8Ut7u7c7db83mPnt5wtq48s	0	2024-11-24 22:08:31.177142+00	2024-11-24 22:13:35.983573+00
17	L1	dsf	0	18	t	f	p7UFNNhIORbxmeNJ7kZ00a200y1jQOeaLPR7akpTfEMHE	\N	2024-11-21 22:48:10.983169+00	2024-11-21 22:53:48.556911+00
27	Lesson 2	Lesson 2 description	1	37	t	f	Njhel9WHKQ7uw2MHGUnaPKFEZGAN9fbUP7SRiULyIUQ	0	2024-11-24 22:08:39.765605+00	2024-11-24 22:13:35.984763+00
28	Lesson 3	Lesson 3 description	2	37	f	t	\N	\N	2024-11-24 22:08:47.376478+00	2024-11-24 22:13:35.985705+00
29	Lesson 4	Lesson 4 description	3	37	t	t	OtjuDK96E18GcmqkLej00VHaqRaaovEBYiAHKdgo2COc	0	2024-11-24 22:08:54.662797+00	2024-11-24 22:13:35.987365+00
30	Lesson 5	Lesson 5 description	4	37	t	t	BizEUZKKGQFrzfw00VOcHs02PP6U4N200IEMzxck1cQNVo	0	2024-11-24 22:09:00.811261+00	2024-11-24 22:13:35.988028+00
39	l1	lesson 1 description	0	30	t	f	ZQPqU3qP7lfu5g3wsRDrHEJlaJFIN1SvLG4pEmC5Xw8	0	2025-01-05 11:56:19.790177+00	2025-01-05 11:58:49.485013+00
31	Lesson 1	L1d	0	38	t	f	rJ01fiXddA9zx2GHVYME01R4kGFeYVV1TqVjSSukNHJP8	0	2024-11-24 22:15:27.623164+00	2024-11-24 22:48:40.69485+00
5	Lesson 1	ld	0	3	t	t	kKBFOLQKPbb01z01k7mql84U8NcG92O1It4c5fBCuT3VU	0	2024-11-15 14:02:33.556366+00	2024-12-02 14:10:06.096524+00
1	l1 	l1 d	1	1	t	f	CegjC9GS88Nh1hLuzXqxGux02i9k902d3id3Smt2vKyKU	0	2024-11-14 22:06:20.655895+00	2024-12-02 14:11:26.601228+00
37	lesson 2	Lesson 2 d	1	52	f	t	\N	\N	2024-12-03 04:34:12.505526+00	2024-12-03 04:34:28.589866+00
36	Lesson 1	Lesson 1 d	0	52	t	f	XV9ko3ma02G202SlE6a994lKZQpSoJjANK600KajRTWYjE	0	2024-12-03 04:33:59.738057+00	2024-12-03 04:36:16.716115+00
38	Intro	How to make the best out of this course	0	46	t	t	aqeTInn014mO6GlIBhKcMwCjn72tmlwIujREh5VtBKMg	0	2024-12-05 16:07:19.596286+00	2024-12-05 16:08:38.877792+00
32	Lesson 2	In this lesson, we'll continue exploring Generics in TypeScript	1	38	t	t	Ngf8V02Do1acYLm02U6YOONRmzficjhCCkLYepIdAh0200k	0	2024-11-25 12:11:44.431164+00	2024-12-06 12:58:00.866273+00
\.


--
-- TOC entry 3830 (class 0 OID 16727)
-- Dependencies: 217
-- Data for Name: migrations; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.migrations (id, name, created_at) FROM stdin;
247	00000-users.ts	2024-11-14 22:02:44.077323
248	00001-categories.ts	2024-11-14 22:02:44.077323
249	00002-courses.ts	2024-11-14 22:02:44.077323
250	00003-modules.ts	2024-11-14 22:02:44.077323
251	00004-lessons.ts	2024-11-14 22:02:44.077323
252	00005-enrollments.ts	2024-11-14 22:02:44.077323
253	00006-user_progress.ts	2024-11-14 22:02:44.077323
254	00007-course_media.ts	2024-11-14 22:02:44.077323
255	00008-sessions.ts	2024-11-14 22:02:44.077323
256	00009-attachments.ts	2024-11-14 22:02:44.077323
257	00010-mux_data.ts	2024-11-14 22:02:44.077323
258	00011-stripe_customers.ts	2024-11-14 22:02:44.077323
259	00012-video_transcripts.ts	2024-11-14 22:02:44.077323
\.


--
-- TOC entry 3838 (class 0 OID 20708)
-- Dependencies: 225
-- Data for Name: modules; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.modules (id, title, description, "position", course_id, is_published, is_free, created_at, updated_at) FROM stdin;
3	Module 1	<p>sdfsd</p>	0	3	t	f	2024-11-15 13:59:05.586817+00	2024-11-15 14:04:09.000845+00
38	Module 3	m3d	2	18	t	f	2024-11-24 22:07:26.726576+00	2024-12-11 15:43:24.655217+00
36	Intro	\N	0	17	f	f	2024-11-22 13:37:40.246157+00	2024-11-22 13:37:49.799863+00
4	Intro	<p>bhjgvhvghvguuvgu</p>	0	4	t	f	2024-11-15 18:16:40.147028+00	2024-11-15 18:21:19.986135+00
1	1	<p>d</p>	0	1	t	f	2024-11-14 22:05:57.655678+00	2024-11-16 14:56:37.659345+00
35	module 2	\N	2	17	f	f	2024-11-22 13:37:35.225093+00	2024-11-22 13:37:49.805785+00
7	Intro	\N	0	5	f	f	2024-11-18 14:43:18.951137+00	2024-11-18 14:43:25.650201+00
6	m1	<p>Md</p>	1	5	t	f	2024-11-18 14:43:10.759697+00	2024-11-18 14:47:00.64805+00
46	Intro	Introduction	0	23	t	f	2024-12-03 03:40:18.561306+00	2025-01-04 15:51:29.443442+00
37	Module 1	This is a description 	0	18	t	f	2024-11-24 22:07:21.75163+00	2024-11-29 16:43:47.201224+00
34	Module 2	l	1	18	t	f	2024-11-22 00:14:13.83918+00	2024-11-29 16:43:47.202223+00
9	Intro	\N	0	6	f	f	2024-11-18 15:29:33.356374+00	2024-11-18 15:29:53.255283+00
8	Module 1	\N	1	6	f	f	2024-11-18 15:28:45.324997+00	2024-11-18 15:29:53.257782+00
39	Module 4	\N	3	18	f	f	2024-11-24 22:07:30.730348+00	2024-11-29 16:43:47.203959+00
33	Module 1: The Basics of Professional Paste-Driven Development (PDD)	Embrace and improve your copy-paste techniques while learning the fundamentals of effective code research and implementation.\n	1	17	t	f	2024-11-22 00:09:24.324178+00	2024-11-24 14:03:22.863214+00
47	Module 1	\N	1	23	f	f	2024-12-03 03:40:30.098223+00	2025-01-04 15:51:29.444903+00
2	M1	<p>d</p>	1	2	t	f	2024-11-15 12:40:25.671334+00	2024-11-19 20:27:06.838122+00
12	Outro	\N	2	2	f	f	2024-11-19 13:59:17.595891+00	2024-11-19 20:27:06.84021+00
10	M2	\N	3	2	f	f	2024-11-19 13:59:06.756079+00	2024-11-19 20:27:06.844041+00
40	Module 5	\N	4	18	f	f	2024-11-24 22:07:35.16786+00	2024-11-29 16:43:47.205303+00
5	Module 1	<p>Module disc</p>	1	4	t	f	2024-11-15 18:16:49.420016+00	2024-11-20 14:03:35.540705+00
13	Module 1	<p>fgrg</p>	0	7	t	f	2024-11-20 20:04:34.787883+00	2024-11-20 20:08:04.326949+00
14	Module 1	\N	1	8	f	f	2024-11-21 11:23:41.683539+00	2024-11-21 11:24:06.263415+00
15	Intro	<p>Disc</p>	0	8	t	f	2024-11-21 11:23:56.534019+00	2024-11-21 11:26:47.392762+00
53	kk	\N	2	23	f	f	2025-01-04 15:51:22.777788+00	2025-01-04 15:51:29.446802+00
48	Module 2	\N	3	23	f	f	2024-12-03 03:40:35.452445+00	2025-01-04 15:51:29.448412+00
16	Module 1	\N	1	11	f	f	2024-11-21 22:04:00.23971+00	2024-11-21 22:04:16.7404+00
11	Intro	<p>Intro to the course</p>	0	2	f	f	2024-11-19 13:59:12.003107+00	2024-12-02 07:41:35.786972+00
17	Module Intro	<p>DSisac</p>	0	11	t	f	2024-11-21 22:04:07.014408+00	2024-11-21 22:06:59.136839+00
18	M1	<p>ds</p>	0	12	t	f	2024-11-21 22:47:50.331398+00	2024-11-21 22:54:10.149913+00
20	M2	\N	1	13	f	f	2024-11-21 23:09:57.578728+00	2024-11-21 23:09:57.578728+00
21	M3	\N	2	13	f	f	2024-11-21 23:10:00.809862+00	2024-11-21 23:10:00.809862+00
19	M1	<p>dxl</p>	0	13	t	f	2024-11-21 23:09:53.544718+00	2024-11-21 23:13:57.956643+00
24	mj	\N	1	14	f	f	2024-11-21 23:42:20.032735+00	2024-11-21 23:42:20.032735+00
25	mjp	\N	2	14	f	f	2024-11-21 23:42:24.161705+00	2024-11-21 23:42:24.161705+00
23	m	jkgk	0	14	t	f	2024-11-21 23:42:16.771691+00	2024-11-21 23:44:16.037548+00
27	rr	\N	1	15	f	f	2024-11-21 23:53:31.036476+00	2024-11-21 23:53:31.036476+00
28	rrr	\N	2	15	f	f	2024-11-21 23:53:34.036503+00	2024-11-21 23:53:34.036503+00
29	rrrr	\N	3	15	f	f	2024-11-21 23:53:36.467319+00	2024-11-21 23:53:36.467319+00
26	r	rrr	0	15	t	f	2024-11-21 23:53:27.804539+00	2024-11-21 23:54:57.470816+00
41	Module 1	\N	1	21	f	f	2024-11-25 13:50:04.017015+00	2024-11-25 13:50:49.999106+00
42	Module 2	\N	2	21	f	f	2024-11-25 13:50:08.887079+00	2024-11-25 13:50:50.000029+00
49	Outro	\N	4	23	f	f	2024-12-03 03:40:45.057538+00	2025-01-04 15:51:29.449848+00
43	Intro	description	0	21	t	f	2024-11-25 13:50:22.519693+00	2024-11-25 13:53:03.90095+00
50	Module1	\N	1	24	f	f	2024-12-03 04:32:51.531067+00	2024-12-03 04:33:17.48631+00
51	Module 2	\N	2	24	f	f	2024-12-03 04:32:56.611252+00	2024-12-03 04:33:17.48894+00
52	Intro	Module description	0	24	t	f	2024-12-03 04:33:06.142578+00	2024-12-03 04:36:32.086039+00
32	wwee	\N	0	16	f	f	2024-11-22 00:03:49.515044+00	2025-01-05 12:04:12.871511+00
30	we	sdfgsdf	1	16	t	f	2024-11-22 00:03:42.774386+00	2025-01-05 12:04:12.873078+00
31	wwe	wee	2	16	f	f	2024-11-22 00:03:46.137356+00	2025-01-05 12:04:12.874418+00
\.


--
-- TOC entry 3850 (class 0 OID 20836)
-- Dependencies: 237
-- Data for Name: mux_data; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.mux_data (id, lesson_id, asset_id, playback_id, created_at, updated_at) FROM stdin;
1	1	3olgT2a02luuo8tRnH99y8xAo4MSXf7w4ErdmxSTxpfo	AYvOdy7DcQb02mT1ElL2YBIVVP7vY12FGx9U901yuv8Wk	2024-11-14 22:06:49.948407+00	2024-11-14 22:06:49.948407+00
2	4	027W01tABDfjxr6Zt3qidxHiQE3WjIQw5o500HxPkeu00tY	MNalIJyej00AV1JWpHhhoY7ppSDgF01IYZwbEhzDXhfuY	2024-11-15 12:41:31.79847+00	2024-11-15 12:41:31.79847+00
3	5	201qvugb56hnuVi5tG26A01hzvUmR02u02E4SSnmuKFF7xo	i9f91g00RB3c4JeBaCTsN7zxe01rxpSA2pu401oJZdtUYk	2024-11-15 14:03:30.83885+00	2024-11-15 14:03:30.83885+00
4	6	Qfqz67TIO13i2K2Vpp3eYUKZQSw8LalRBavXrXcZ9Vk	Cs3DQ8vMpCzZO3duYa6I4R00xq5vh7k00Mk6ESeNpaZMU	2024-11-15 18:19:28.953221+00	2024-11-15 18:19:28.953221+00
5	1	102OQUhHPbs61BPE7VMseSHjLZItJvy1UBUcMRLUjudw	D00XoEFJR6YLfm6KMrujMiica00cuT3xlSGOBhN1K7cns	2024-11-16 14:51:29.231273+00	2024-11-16 14:51:29.231273+00
6	8	9BAViHWt8mTRzn8OnTwRr6czwUPYwcdtqU32d01RA6z4	1I2qwz00mrW5ClMIp7nzXk5M1pIYVDES014yMEcX6yrmk	2024-11-18 14:45:48.042915+00	2024-11-18 14:45:48.042915+00
7	9	e9T1W02trCXkZ2aDg6JU0002Wxe501cpSHi2uQvr4M4u7vc	LHzFB016hwDSThCesMPc7MTB9C02nuxgSL5qRN02vcwNbk	2024-11-19 14:01:13.886475+00	2024-11-19 14:01:13.886475+00
8	11	xVJrXZRGpqljIieYYhUrMnc0101CBP1vpoMjbjW9vRRnw	xSdIoLSRLT01EjB78JSLpv2MMUNnQ1X1lbwIrHlzQgdE	2024-11-20 14:03:17.361658+00	2024-11-20 14:03:17.361658+00
9	12	hk00Iv2Suz5MS5idknPRry00wN8MtoItVAOQbSVCWPZec	Bo2Tk31JoAOtzFwxoRFD2DdJipG7PVOct1RYnXJD1OE	2024-11-20 20:07:39.526856+00	2024-11-20 20:07:39.526856+00
10	15	OYi32orvQDhplUBjicq1iI2vNR1k9FgbKI01WkprlWxs	6IJr01K9C83F3JBcgztDmFXZqWeIf7qq6SFpqHTGtb00g	2024-11-21 11:26:14.196323+00	2024-11-21 11:26:14.196323+00
11	16	SvFTVwmN4WXlq3J02Gi8DrX00Nw00io1ZQKQcw9tvRsT4w	Epns8m6Deqtpkx16Jsg901NbeaxzalqiduupjVmqJOgM	2024-11-21 22:06:12.757145+00	2024-11-21 22:06:12.757145+00
12	17	26GWBDJRZyPVQSSAkEJPLi5oZGmZ9mo8Ngnj9OhQcX4	p7UFNNhIORbxmeNJ7kZ00a200y1jQOeaLPR7akpTfEMHE	2024-11-21 22:48:48.550575+00	2024-11-21 22:48:48.550575+00
13	18	RzUlXS1zTvDdSBLA4QfhhL1gH3uJANEMp3DRoZMVm6c	t3NhjosZ1XW3BBCCb401ZuzPz9GB6GztTkHId7Ss5y74	2024-11-21 23:11:21.182772+00	2024-11-21 23:11:21.182772+00
14	19	uwhDYjcyci3orkgPIULTAdZkRaGwRfaffcYLgDZ01qqk	iriN3WRO301qOZw3o1cmMtwd01101Qp6EVu2lVT6L01oUkM	2024-11-21 23:43:40.212644+00	2024-11-21 23:43:40.212644+00
15	20	crizabqrevwGsclN5Yj3NiZ34x02tuW5UPhyfneHucto	GpMa293O62xTGllasfIg005qxsNGYQgm023uYVMuv1BW8	2024-11-21 23:54:40.505278+00	2024-11-21 23:54:40.505278+00
16	22	FdRbg7Ji94d6ejhliWWXtKdUTLcLi0101UqLVn469GBRw	ZKbEk5shggov00pBKUfokLJxADyjiEiKZF9I01lHkp9tI	2024-11-22 00:04:37.606155+00	2024-11-22 00:04:37.606155+00
17	23	jkR4d9ZYmUlw4ICJqtkgzp01aSiOFYmX00T01EhbYrsXzU	Bz4cuu1COcvFXyRxBudEEq01GMWbCFm2llEVxJm01fwhc	2024-11-22 00:10:10.890379+00	2024-11-22 00:10:10.890379+00
18	24	f1YKzkNfiq8mosoe01602fjSW2H2Pb01cfTDLOo01vG99eA	L006gTPCBmv3UzEQ00QSfTYJzW6mY1WssXACDAsi8ZndI	2024-11-22 00:15:13.708415+00	2024-11-22 00:15:13.708415+00
19	25	sCShZ002lEN4b9K6COKX2kA00vCvrRLySDguvKCerqyww	CrwFk00316XrCLBhcSRAG01CmVPNeDVeafUXLyBE5vWZc	2024-11-22 20:02:42.087294+00	2024-11-22 20:02:42.087294+00
20	25	TqI017PvwogcWOJu9lWy2WHylpb01JjpTEj01O00wdh26Io	vlxmcays017GYBxZi01022nwjFVNUbSs6k8Z701DHr5S3XQ	2024-11-22 22:40:35.751415+00	2024-11-22 22:40:35.751415+00
21	24	xvflc9AjZ472LqWIz9aBx9Hniwk9vFBkfYui00wHVZuA	VwOUPIhgv14QQs463tPj01zKBJx6e1r3AolDOWPWu8BI	2024-11-23 15:09:41.061421+00	2024-11-23 15:09:41.061421+00
22	24	TZ0002GtO8019vl01jvbfmjPZqWXcVWooyyReYR1sh202PrY	TdBG4CKAjJ1x84ukVO00Ig01RFGSlKoOnD02iThJ7tZqM8	2024-11-23 15:20:50.942573+00	2024-11-23 15:20:50.942573+00
23	22	EA1FEcIdOL844rToI6FidkbOqi024CQpQ8SvhE7M8nnM	R01KY00BaPsfH6602cBtSO9nX651JZCU02WVw78jkLhDLMg	2024-11-23 20:21:10.311152+00	2024-11-23 20:21:10.311152+00
24	23	C0100xpCHKz6ooIah00JPC58iOBJ2LqElPZVz201QrJHlPU	KJxkwtyYLO9MKjIcLLDsXszL3vd2c5mPsqEAKx1SrFA	2024-11-24 20:23:03.344591+00	2024-11-24 20:23:03.344591+00
25	23	iHY401hKDgSaxrrqqBF02gsB1LGCQ9kFTTZiPBGCqTaTo	bBF5ZSe01bCcLvxYGGbEhJsvoJBWBLk00KtMAcaLFH4hg	2024-11-24 20:31:08.879908+00	2024-11-24 20:31:08.879908+00
26	23	02jwSHy0013cOpfbmZgfx5SavX029GWWM7qLMYDh3j5xuE	xyb7nBgyMfTxUYloMhIfNqE004CV01LimkRC8AVmGqUc4	2024-11-24 21:18:36.462357+00	2024-11-24 21:18:36.462357+00
27	23	52gxfx5Ur2mMFnSIU87lccfS7M02v66M5Rv0000Xhp1x3Q	537WC5Nnu7kmzThWTxtA1CyLw02XFZQT5EjEvKcFxBbE	2024-11-24 22:03:41.877944+00	2024-11-24 22:03:41.877944+00
28	26	B3p01zqI5dbMnwNSkPfFI3EmtedwflFJf01Xs7F01FSo78	vJ3pJt008xf5Uvwr55JQH8Ut7u7c7db83mPnt5wtq48s	2024-11-24 22:10:08.250652+00	2024-11-24 22:10:08.250652+00
29	30	01bm9LT77h8Dle9tfU024zWNVzYV8juOQGXSAqGx7YRd4	BizEUZKKGQFrzfw00VOcHs02PP6U4N200IEMzxck1cQNVo	2024-11-24 22:11:03.12938+00	2024-11-24 22:11:03.12938+00
30	27	OOO89TEzMy6eX3MTJw5Ef6B008iDAULkB501T01dcRNymQ	Njhel9WHKQ7uw2MHGUnaPKFEZGAN9fbUP7SRiULyIUQ	2024-11-24 22:11:54.769979+00	2024-11-24 22:11:54.769979+00
31	29	NMOLWOU00Zj3vjSBJfiT7nx6LlOi5J01koY10000OdoOlVU	OtjuDK96E18GcmqkLej00VHaqRaaovEBYiAHKdgo2COc	2024-11-24 22:12:26.923615+00	2024-11-24 22:12:26.923615+00
32	31	kB7RXBcEemM02HWiRuwEJCj5BOmwCc02UPb78B8X3hjno	rJ01fiXddA9zx2GHVYME01R4kGFeYVV1TqVjSSukNHJP8	2024-11-24 22:48:32.456302+00	2024-11-24 22:48:32.456302+00
33	32	tNUem1wa00waB00pi9zswvXzFN17LxEW7a8D01H00FDElFw	Ngf8V02Do1acYLm02U6YOONRmzficjhCCkLYepIdAh0200k	2024-11-25 12:12:10.748452+00	2024-11-25 12:12:10.748452+00
34	33	5LZ78Wnu4Wb302ErYylYynCSdBtUhL8Lb1BkkTEdHyvs	gNGh4L93IB9IeKzRejgDg3ttOPKc6r8HVVdtpVyz2LA	2024-11-25 13:52:41.891373+00	2024-11-25 13:52:41.891373+00
36	5	ymDFHFZw4m2QkQyw02rsEaxBbNt01QijlJDhksMECse9s	kKBFOLQKPbb01z01k7mql84U8NcG92O1It4c5fBCuT3VU	2024-12-02 14:09:59.538449+00	2024-12-02 14:09:59.538449+00
37	1	epA9L1WM01008aiu6CgwjhL0102gWcUSMg00022vNnvXVlgzI	CegjC9GS88Nh1hLuzXqxGux02i9k902d3id3Smt2vKyKU	2024-12-02 14:11:26.538318+00	2024-12-02 14:11:26.538318+00
38	36	Y6ZqnH2f9y25q9B443F17K7P1Iw7CeycU00RgJ8hYrHQ	XV9ko3ma02G202SlE6a994lKZQpSoJjANK600KajRTWYjE	2024-12-03 04:36:02.035355+00	2024-12-03 04:36:02.035355+00
39	38	UtufSv91XO00TsVKYDWhWx2101skPwypQSlF0102BpGhXf8	aqeTInn014mO6GlIBhKcMwCjn72tmlwIujREh5VtBKMg	2024-12-05 16:08:29.976173+00	2024-12-05 16:08:29.976173+00
40	39	D5dtzpXXEabzdL958CZRWQu398gnSe1LJ25mL9sJKHY	ZQPqU3qP7lfu5g3wsRDrHEJlaJFIN1SvLG4pEmC5Xw8	2025-01-05 11:57:51.123963+00	2025-01-05 11:57:51.123963+00
\.


--
-- TOC entry 3846 (class 0 OID 20806)
-- Dependencies: 233
-- Data for Name: sessions; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.sessions (id, token, expiry_timestamp, user_id) FROM stdin;
64	/FzNxr07xpqglk3MmxNIN3onqQaTa9rKlDBuOnnrfvhFtfw0Z++zPFQf5ysO01IgGtFU6xdWitoMmeMoLlZChn95LUnRVmcfVrdc9Zt+a5tS0fclgmRS9Uy3Fk4mzN8oDuhLlQ==	2025-01-06 12:06:01.700167	3
\.


--
-- TOC entry 3852 (class 0 OID 20854)
-- Dependencies: 239
-- Data for Name: stripe_customers; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.stripe_customers (id, user_id, stripe_customer_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3842 (class 0 OID 20770)
-- Dependencies: 229
-- Data for Name: user_progress; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.user_progress (id, user_id, lesson_id, is_completed, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3832 (class 0 OID 20665)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.users (id, name, email, password_hash, role, created_at, updated_at) FROM stdin;
1	dany	dany@something.com	$2b$12$FZ4D.h8lAxU0eOykyBYZneBKmy021bb0VeKU0WvB7IcjWeeK7m2H6	Instructor	2024-11-14 22:03:46.185546+00	2024-11-14 22:03:46.185546+00
2	nusa	einas.nasr@outlook.com	$2b$12$0V8qWboqQA/K845EV0bVU.HpJN6ezILs.ZCkJpTH.CVBdNAgLk3ey	Instructor	2024-11-15 18:10:48.907989+00	2024-11-15 18:10:48.907989+00
3	mark	mark@instructooor.com	$2b$12$Mm2CnkTMtPa2T5M0wkLM5.232cRXHCdcwSq3NYSIy.T17DO.6HnZm	Instructor	2024-11-18 14:19:17.899462+00	2024-11-18 14:19:17.899462+00
4	ninja	ninja@ninja.com	$2b$12$hWn/.dcmmqmypMz9bgmsWuN7fwuONjmdRx0lRwFA169jkdJeabBdK	Instructor	2024-11-18 15:22:57.15794+00	2024-11-18 15:22:57.15794+00
5	netninja	net@ninjs.com	$2b$12$bDyZQk30fv6SHEXSMxH/O.XHjmj7834J36hmDGYsvO91lpqfm0Yt6	Instructor	2024-11-21 11:19:34.366523+00	2024-11-21 11:19:34.366523+00
6	max	max@mari.com	$2b$12$OlDYUltqRdEKvcbpmOgkPOhTHotNMeNbNMkMtLiMYe7WMVTr3oi7a	Instructor	2024-11-21 14:11:00.048573+00	2024-11-21 14:11:00.048573+00
7	marlo	marlo@example.com	$2b$12$GoZgf4nuJpXcHPgyI42WbOFp8uk.zuKBzySgs2AfCXi3o1c9/DoPe	Instructor	2024-11-21 18:42:28.305516+00	2024-11-21 18:42:28.305516+00
8	spongebob 	spongebob@example.com	$2b$12$/RIiFgnjfNUt/4NcrZDuMud0pjCcuPuJKItX2MkVEzYsvZrD1wsQ6	Instructor	2024-11-21 22:00:59.578553+00	2024-11-21 22:00:59.578553+00
10	tyler	tyler@durden.com	$2b$12$yIkmbVhUEsmV3QmDKDoUQeIov20kMWGpTY7lLkyXzWdNWKorhFEZq	Instructor	2024-11-21 23:24:59.808513+00	2024-11-21 23:24:59.808513+00
11	bob	bob@push.com	$2b$12$YBjWsNtcxQaCHY2RIJiihuWTyqArJRco1Wk3tBRwDxyWNZ54/rmv6	Instructor	2024-11-23 14:31:09.992172+00	2024-11-23 14:31:09.992172+00
12	lenard	lenard@bla.com	$2b$12$fdO2KXgZ0YMbxJsSECOmwul3WhPeatoKc1cNb2vVp8T3kg.OwgPdi	Instructor	2024-11-23 15:16:01.829606+00	2024-11-23 15:16:01.829606+00
13	ziko	ziko@ziko.com	$2b$12$7LwY36rC0uE1aAtWjdbIxuW.xWrWHJkhXWP0t//1JSojorUgB9qUG	Instructor	2024-11-25 12:04:11.519146+00	2024-11-25 12:04:11.519146+00
14	maxi	maxi@example.com	$2b$12$JohePxJzOIPqSjkjxOntzeekzzN.7SgVyw38pPGHtXoHkJ2r55LqK	Instructor	2024-11-25 13:36:14.582773+00	2024-11-25 13:36:14.582773+00
15	marlon	marlon@example.com	$2b$12$iM0vM9N/A9dXFUFtpWCB9eyplWR/H1nVj5elXewBLkcco3teCDN0u	Instructor	2024-11-25 13:44:25.387162+00	2024-11-25 13:44:25.387162+00
16	nas	nas@example.com	$2b$12$9tBNZ0Rqv53XAFOmSS9vM.KaS5ENbGP3smB5PKdzakQpMr9aQzSWu	Instructor	2024-12-01 11:20:08.099704+00	2024-12-01 11:20:08.099704+00
17	maso	maso@gmail.com	$2b$12$f2IhTnReivg2d9Z0yf13zuglUk7xUOqMPx7/R.2Vgu.1NaedVOJuy	Student	2024-12-01 22:30:31.261026+00	2024-12-01 22:30:31.261026+00
18	marko	marko@gmail.com	$2b$12$an0W0k25nCGG2srWFwmtzemtmqdEF5zRm9RvGLdVhAuZGVOPTm8ua	Instructor	2024-12-03 04:28:01.684505+00	2024-12-03 04:28:01.684505+00
9	fera	itsnotf22@gmail.com	$2b$12$fczZV4NcwrWooVKCdQJrbujXvJ0UUhdOAOuzMdsCgxYjP4UBguJA6	Instructor	2024-11-21 22:32:31.554606+00	2024-12-09 14:11:37.422586+00
19	zeko	zeko@student.com	$2b$12$/jjK4oHqUDFp6o1nf44jAOOquLvjQlXy4PVGL1IV22QfP45pskue2	Student	2024-12-09 14:38:20.229139+00	2024-12-09 14:38:20.229139+00
\.


--
-- TOC entry 3854 (class 0 OID 20875)
-- Dependencies: 241
-- Data for Name: video_transcripts; Type: TABLE DATA; Schema: lms; Owner: lms
--

COPY lms.video_transcripts (id, lesson_id, transcript_segments, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3865 (class 0 OID 0)
-- Dependencies: 234
-- Name: attachments_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.attachments_id_seq', 16, true);


--
-- TOC entry 3866 (class 0 OID 0)
-- Dependencies: 220
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.categories_id_seq', 12, true);


--
-- TOC entry 3867 (class 0 OID 0)
-- Dependencies: 230
-- Name: course_media_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.course_media_id_seq', 1, false);


--
-- TOC entry 3868 (class 0 OID 0)
-- Dependencies: 222
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.courses_id_seq', 24, true);


--
-- TOC entry 3869 (class 0 OID 0)
-- Dependencies: 242
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.enrollments_id_seq', 61, true);


--
-- TOC entry 3870 (class 0 OID 0)
-- Dependencies: 226
-- Name: lessons_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.lessons_id_seq', 39, true);


--
-- TOC entry 3871 (class 0 OID 0)
-- Dependencies: 216
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.migrations_id_seq', 259, true);


--
-- TOC entry 3872 (class 0 OID 0)
-- Dependencies: 224
-- Name: modules_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.modules_id_seq', 53, true);


--
-- TOC entry 3873 (class 0 OID 0)
-- Dependencies: 236
-- Name: mux_data_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.mux_data_id_seq', 40, true);


--
-- TOC entry 3874 (class 0 OID 0)
-- Dependencies: 232
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.sessions_id_seq', 64, true);


--
-- TOC entry 3875 (class 0 OID 0)
-- Dependencies: 238
-- Name: stripe_customers_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.stripe_customers_id_seq', 1, false);


--
-- TOC entry 3876 (class 0 OID 0)
-- Dependencies: 228
-- Name: user_progress_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.user_progress_id_seq', 1, false);


--
-- TOC entry 3877 (class 0 OID 0)
-- Dependencies: 218
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.users_id_seq', 19, true);


--
-- TOC entry 3878 (class 0 OID 0)
-- Dependencies: 240
-- Name: video_transcripts_id_seq; Type: SEQUENCE SET; Schema: lms; Owner: lms
--

SELECT pg_catalog.setval('lms.video_transcripts_id_seq', 1, false);


--
-- TOC entry 3649 (class 2606 OID 20828)
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- TOC entry 3619 (class 2606 OID 20683)
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- TOC entry 3621 (class 2606 OID 20681)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3643 (class 2606 OID 20799)
-- Name: course_media course_media_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.course_media
    ADD CONSTRAINT course_media_pkey PRIMARY KEY (id);


--
-- TOC entry 3623 (class 2606 OID 20695)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 3668 (class 2606 OID 20900)
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 3670 (class 2606 OID 20902)
-- Name: enrollments enrollments_user_id_course_id_key; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.enrollments
    ADD CONSTRAINT enrollments_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- TOC entry 3634 (class 2606 OID 20742)
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- TOC entry 3613 (class 2606 OID 16732)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3628 (class 2606 OID 20720)
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- TOC entry 3655 (class 2606 OID 20844)
-- Name: mux_data mux_data_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.mux_data
    ADD CONSTRAINT mux_data_pkey PRIMARY KEY (id);


--
-- TOC entry 3645 (class 2606 OID 20811)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3647 (class 2606 OID 20813)
-- Name: sessions sessions_token_key; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.sessions
    ADD CONSTRAINT sessions_token_key UNIQUE (token);


--
-- TOC entry 3659 (class 2606 OID 20862)
-- Name: stripe_customers stripe_customers_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.stripe_customers
    ADD CONSTRAINT stripe_customers_pkey PRIMARY KEY (id);


--
-- TOC entry 3661 (class 2606 OID 20866)
-- Name: stripe_customers stripe_customers_stripe_customer_id_key; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.stripe_customers
    ADD CONSTRAINT stripe_customers_stripe_customer_id_key UNIQUE (stripe_customer_id);


--
-- TOC entry 3663 (class 2606 OID 20864)
-- Name: stripe_customers stripe_customers_user_id_key; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.stripe_customers
    ADD CONSTRAINT stripe_customers_user_id_key UNIQUE (user_id);


--
-- TOC entry 3639 (class 2606 OID 20777)
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.user_progress
    ADD CONSTRAINT user_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 3641 (class 2606 OID 20779)
-- Name: user_progress user_progress_user_id_lesson_id_key; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.user_progress
    ADD CONSTRAINT user_progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id);


--
-- TOC entry 3615 (class 2606 OID 20675)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3617 (class 2606 OID 20673)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3666 (class 2606 OID 20883)
-- Name: video_transcripts video_transcripts_pkey; Type: CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.video_transcripts
    ADD CONSTRAINT video_transcripts_pkey PRIMARY KEY (id);


--
-- TOC entry 3624 (class 1259 OID 20706)
-- Name: idx_category_id; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_category_id ON lms.courses USING btree (category_id);


--
-- TOC entry 3650 (class 1259 OID 20834)
-- Name: idx_course_id; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_course_id ON lms.attachments USING btree (course_id);


--
-- TOC entry 3671 (class 1259 OID 20913)
-- Name: idx_enrollments_user_course; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_enrollments_user_course ON lms.enrollments USING btree (user_id, course_id);


--
-- TOC entry 3629 (class 1259 OID 20751)
-- Name: idx_lessons_is_free; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_lessons_is_free ON lms.lessons USING btree (is_free);


--
-- TOC entry 3630 (class 1259 OID 20750)
-- Name: idx_lessons_is_published; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_lessons_is_published ON lms.lessons USING btree (is_published);


--
-- TOC entry 3631 (class 1259 OID 20748)
-- Name: idx_lessons_module_id; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_lessons_module_id ON lms.lessons USING btree (module_id);


--
-- TOC entry 3632 (class 1259 OID 20749)
-- Name: idx_lessons_position; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_lessons_position ON lms.lessons USING btree ("position");


--
-- TOC entry 3625 (class 1259 OID 20726)
-- Name: idx_modules_course_id; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_modules_course_id ON lms.modules USING btree (course_id);


--
-- TOC entry 3626 (class 1259 OID 20727)
-- Name: idx_modules_position; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_modules_position ON lms.modules USING btree ("position");


--
-- TOC entry 3651 (class 1259 OID 20851)
-- Name: idx_mux_data_asset_id; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_mux_data_asset_id ON lms.mux_data USING btree (asset_id);


--
-- TOC entry 3652 (class 1259 OID 20850)
-- Name: idx_mux_data_lesson_id; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_mux_data_lesson_id ON lms.mux_data USING btree (lesson_id);


--
-- TOC entry 3653 (class 1259 OID 20852)
-- Name: idx_mux_data_playback_id; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_mux_data_playback_id ON lms.mux_data USING btree (playback_id);


--
-- TOC entry 3656 (class 1259 OID 20872)
-- Name: idx_stripe_customers_stripe_customer_id; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_stripe_customers_stripe_customer_id ON lms.stripe_customers USING btree (stripe_customer_id);


--
-- TOC entry 3657 (class 1259 OID 20873)
-- Name: idx_stripe_customers_user_id; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_stripe_customers_user_id ON lms.stripe_customers USING btree (user_id);


--
-- TOC entry 3635 (class 1259 OID 20792)
-- Name: idx_user_progress_is_completed; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_user_progress_is_completed ON lms.user_progress USING btree (is_completed);


--
-- TOC entry 3636 (class 1259 OID 20791)
-- Name: idx_user_progress_lesson_id; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_user_progress_lesson_id ON lms.user_progress USING btree (lesson_id);


--
-- TOC entry 3637 (class 1259 OID 20790)
-- Name: idx_user_progress_user_id; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_user_progress_user_id ON lms.user_progress USING btree (user_id);


--
-- TOC entry 3664 (class 1259 OID 20889)
-- Name: idx_video_transcripts_lesson_id; Type: INDEX; Schema: lms; Owner: lms
--

CREATE INDEX idx_video_transcripts_lesson_id ON lms.video_transcripts USING btree (lesson_id);


--
-- TOC entry 3680 (class 2606 OID 20829)
-- Name: attachments attachments_course_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.attachments
    ADD CONSTRAINT attachments_course_id_fkey FOREIGN KEY (course_id) REFERENCES lms.courses(id) ON DELETE CASCADE;


--
-- TOC entry 3678 (class 2606 OID 20800)
-- Name: course_media course_media_course_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.course_media
    ADD CONSTRAINT course_media_course_id_fkey FOREIGN KEY (course_id) REFERENCES lms.courses(id) ON DELETE CASCADE;


--
-- TOC entry 3672 (class 2606 OID 20701)
-- Name: courses courses_category_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.courses
    ADD CONSTRAINT courses_category_id_fkey FOREIGN KEY (category_id) REFERENCES lms.categories(id);


--
-- TOC entry 3673 (class 2606 OID 20696)
-- Name: courses courses_instructor_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.courses
    ADD CONSTRAINT courses_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES lms.users(id);


--
-- TOC entry 3684 (class 2606 OID 20908)
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES lms.courses(id) ON DELETE CASCADE;


--
-- TOC entry 3685 (class 2606 OID 20903)
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES lms.users(id) ON DELETE CASCADE;


--
-- TOC entry 3675 (class 2606 OID 20743)
-- Name: lessons lessons_module_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.lessons
    ADD CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES lms.modules(id) ON DELETE CASCADE;


--
-- TOC entry 3674 (class 2606 OID 20721)
-- Name: modules modules_course_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.modules
    ADD CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES lms.courses(id) ON DELETE CASCADE;


--
-- TOC entry 3681 (class 2606 OID 20845)
-- Name: mux_data mux_data_lesson_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.mux_data
    ADD CONSTRAINT mux_data_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES lms.lessons(id) ON DELETE CASCADE;


--
-- TOC entry 3679 (class 2606 OID 20814)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES lms.users(id) ON DELETE CASCADE;


--
-- TOC entry 3682 (class 2606 OID 20867)
-- Name: stripe_customers stripe_customers_user_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.stripe_customers
    ADD CONSTRAINT stripe_customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES lms.users(id) ON DELETE CASCADE;


--
-- TOC entry 3676 (class 2606 OID 20785)
-- Name: user_progress user_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.user_progress
    ADD CONSTRAINT user_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES lms.lessons(id) ON DELETE CASCADE;


--
-- TOC entry 3677 (class 2606 OID 20780)
-- Name: user_progress user_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.user_progress
    ADD CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES lms.users(id) ON DELETE CASCADE;


--
-- TOC entry 3683 (class 2606 OID 20884)
-- Name: video_transcripts video_transcripts_lesson_id_fkey; Type: FK CONSTRAINT; Schema: lms; Owner: lms
--

ALTER TABLE ONLY lms.video_transcripts
    ADD CONSTRAINT video_transcripts_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES lms.lessons(id) ON DELETE CASCADE;


--
-- TOC entry 3863 (class 0 OID 0)
-- Dependencies: 3862
-- Name: DATABASE lms; Type: ACL; Schema: -; Owner: wesamnrr
--

GRANT ALL ON DATABASE lms TO lms;


-- Completed on 2025-01-05 15:11:54 CET

--
-- PostgreSQL database dump complete
--

