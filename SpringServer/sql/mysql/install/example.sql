USE process;

DROP TABLE IF EXISTS public_example;

CREATE TABLE public_example
(
   id integer NOT NULL auto_increment,
   a varchar(256) NOT NULL, 
   b varchar(256) NULL, 
   PRIMARY KEY (id)
);

SHOW TABLES;

INSERT INTO public_example(id, a, b) VALUES (01,'sample a value', 'sample b value');

SELECT * FROM public_example;
