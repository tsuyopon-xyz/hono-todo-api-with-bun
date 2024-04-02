import { Hono } from 'hono';
import { addRouteForCreateTodo } from './create';
import { addRouteForGetTodos } from './list';
import { addRouteForGetTodo } from './find';
import TodoRepository from '@src/datasources/TodoRepository';
import CreateTodoUseCase from '@src/usecases/CreateTodoUsecase';
import CreateTodoController from '@src/controllers/todo/CreateTodoController';
import GetTodosUsecase from '@src/usecases/GetTodosUsecase';
import GetTodosController from '@src/controllers/todo/GetTodosController';
import GetTodoUsecase from '@src/usecases/GetTodoUsecase';
import GetTodoController from '@src/controllers/todo/GetTodoController';

const todoRouter = new Hono();

// TODO: DI Containerを使って、引数の型から自動的にあらかじめ用意したインスタンスが設定されるような仕組みができないか調べる
const todoRepository = new TodoRepository();
const createTodoUsecase = new CreateTodoUseCase(todoRepository);
const createTodoController = new CreateTodoController(createTodoUsecase);
const getTodosUsecase = new GetTodosUsecase(todoRepository);
const getTodosController = new GetTodosController(getTodosUsecase);
const getTodoUsecase = new GetTodoUsecase(todoRepository);
const getTodoController = new GetTodoController(getTodoUsecase);

addRouteForCreateTodo({ todoRouter, createTodoController });
addRouteForGetTodos({ todoRouter, getTodosController });
addRouteForGetTodo({ todoRouter, getTodoController });

export default todoRouter;
