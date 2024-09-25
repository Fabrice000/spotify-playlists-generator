from django.views.generic import TemplateView
from django.shortcuts import render
import requests
from bs4 import BeautifulSoup
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from django.http import JsonResponse
client_id = ""
client_secret = ""
def process_client_data(request):
    global client_id,client_secret
    if request.method == 'POST':
        client_id = request.POST.get('client_id')
        client_secret = request.POST.get('client_secret')
        return JsonResponse({'message': 'Data received successfully'})
    return JsonResponse({'error': 'Invalid request'}, status=400)


class HomePageView(TemplateView):
    template_name = 'home.html'
    
def generate(request):
    print(client_id,client_secret)
    if request.method == 'POST':
        date = request.POST.get('date')
        print(date)
        year = date.split('-')[0]
        print(year)
        def billboard_scrapper():
            billborad_url = f"https://www.billboard.com/charts/hot-100/{date}/"
            response = requests.get(billborad_url)
            soup = BeautifulSoup(response.text,'html.parser')
            song_artist_names = soup.find_all(name="span",class_="a-no-trucate")
            song_titles = soup.find_all(name="h3",class_="a-no-trucate")
            artists_names = [name.getText().strip() for name in song_artist_names]
            titles = [title.getText().strip() for title in song_titles]
            print(len(artists_names))
            print(len(titles))
            return artists_names,titles
        artists_names,titles=billboard_scrapper()
        print(artists_names,titles)
        try:
            sp = spotipy.Spotify(
            auth_manager=SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri="http://localhost:8888/callback",
            scope='playlist-modify-private',
            show_dialog=True,
            cache_path='./.cache.txt')
            )
        except spotipy.exceptions.SpotifyOauthError as e:
            print(f"Error: {e}")
            return JsonResponse({"error": "Authentication failed"}, status=400)
        user_id = sp.current_user()["id"]
        uris = []
        for title in titles:
            result = sp.search(q=f"track:{title} year:{year}", type="track")
            try:
                uri = result["tracks"]["items"][0]["uri"]
                uris.append(uri)
            except IndexError:
                print(f"{title} doesn't exist in Spotify. Skipped.")
        playlist = sp.user_playlist_create(user_id,f"{date} Billboard top 100" , public=False)
        sp.user_playlist_add_tracks(user_id,playlist["id"],tracks=uris)
        return render(request, 'generate.html' , locals())
    else:
        return 0



