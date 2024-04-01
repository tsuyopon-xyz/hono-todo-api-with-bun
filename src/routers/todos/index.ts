import { Hono } from 'hono';
import { addRouteForCreateTodo } from './create';
import TodoRepository from '@src/datasources/TodoRepository';
import CreateTodoUseCase from '@src/usecases/CreateTodoUsecase';
import CreateTodoController from '@src/controllers/todo/CreateTodoController';

const todoRouter = new Hono();

// TODO: DI Containerを使って、引数の型から自動的にあらかじめ用意したインスタンスが設定されるような仕組みができないか調べる
const todoRepository = new TodoRepository();
const createTodoUsecase = new CreateTodoUseCase(todoRepository);
const createTodoController = new CreateTodoController(createTodoUsecase);

addRouteForCreateTodo({ todoRouter, createTodoController });

export default todoRouter;
