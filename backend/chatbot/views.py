from ast import Global
from django.shortcuts import render
from rest_framework.decorators import api_view
from .chatbotService.chartBotService import get_bot_response
from rest_framework.response import Response

prompt_list = [
        'I am creating a app for people who want to learn cook, so suppose you are a chef, you will teach them how to cook, however if they already know how to cook than you can help them decide which food to it, answer there questions related to reciepes,etc but beaware if user asks for something unrelated to food dont tell him about it.\n',
        '\nHuman: Hi',
        '\nAI: You good?'
    ]

@api_view(['POST'])
def chatbot_controller(request):
        print(request.data, 'request.data::')
        global prompt_list
        try:
            user_input = request.data['prompt']
            if(user_input == 'exit'):
                prompt_list = [
                           'I am creating a app for people who want to learn cook, so suppose you are a chef, you will teach them how to cook, however if they already know how to cook than you can help them decide which food to it, answer there questions related to reciepes,etc but beaware if user asks for something unrelated to food dont tell him about it.\n',
                    '\nHuman: Hi',
                    '\nAI: You good?'
                ]
            response = get_bot_response(user_input, prompt_list)
            print(f'bot {response}')
            return Response(response, status=200)
        except Exception as e:
            print('err:', e)
            return Response('error', status=500)
            