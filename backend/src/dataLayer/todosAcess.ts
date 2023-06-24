import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS);
const docClient = new XAWS.DynamoDB.DocumentClient();

const logger = createLogger('TodosAccess');

export class TodosAccess {
    constructor(
        private readonly todosTable = process.env.TODOS_TABLE
    ) { }

    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.debug('Getting all todos');

        const params = {
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        };
  
        const result = await docClient.query(params).promise();
  
        return result.Items as TodoItem[];
    }
  
    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.debug('Create new todo');

        await docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise();
  
        return todo as TodoItem;
    }

    async updateTodo(todoId: string, userId: string, model: TodoUpdate): Promise<TodoItem> {
        logger.debug('Update todo');

        const params = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId                
            },
            UpdateExpression: "set #todoName = :todoName, dueDate = :dueDate, done = :done",
            ExpressionAttributeNames: { '#todoName': "name" },
            ExpressionAttributeValues: {
                ":todoName": model.name,
                ":dueDate": model.dueDate,
                ":done": model.done
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await docClient.update(params).promise();

        return result.Attributes as TodoItem;
    }

    async deleteTodo(todoId: string, userId: string): Promise<any> {
        console.log("Deleting todo");

        const params = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId                
            },
        };

        return await docClient.delete(params).promise();
    }

    async updateAttachmentForTodo(todoId: string, userId: string, attachmentUrl: string): Promise<TodoItem> {
        logger.debug('Update attachment');

        const params = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId                
            },
            UpdateExpression: "set attachmentUrl = :url",
            ExpressionAttributeValues: {
                ":url": attachmentUrl
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await docClient.update(params).promise();

        return result.Attributes as TodoItem;
    }

    async getTodosDone(userId: string): Promise<TodoItem[]> {
        logger.debug('Getting all todos done');
        
        const params = {
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            FilterExpression: 'done = :done',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':done' : true,
            }
        }

        const result = await docClient.query(params).promise();
        return result.Items as TodoItem[];
    }

    async getTodosNotDone(userId: string): Promise<TodoItem[]> {
        logger.debug('Getting all todos not done');
        
        const params = {
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            FilterExpression: 'done = :done',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':done' : false,
            }
        }

        const result = await docClient.query(params).promise();
        return result.Items as TodoItem[];
    }
}