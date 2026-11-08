#!/bin/bash
set -e

# Fighter 1: Ryu
ffmpeg -y -loop 1 -t 0.35 -i images/anime_fighter_ryu.jpg \
  -loop 1 -t 0.50 -i images/anime_fighter_ryu_impact.jpg \
  -loop 1 -t 0.15 -i images/anime_fighter_ryu.jpg \
  -filter_complex "[0:v]scale=720:960,zoompan=z='min(zoom+0.04,1.3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=11:s=720x960:fps=30[v0]; \
  [1:v]scale=720:960,zoompan=z='1.2+0.05*sin(in*15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=15:s=720x960:fps=30[v1]; \
  [2:v]scale=720:960,fps=30[v2]; \
  [v0][v1][v2]concat=n=3:v=1:a=0,format=yuv420p[out]" \
  -map "[out]" -c:v libx264 -pix_fmt yuv420p -r 30 -t 1.0 public/videos/ryu_combat_move.mp4

# Fighter 2: Ren
ffmpeg -y -loop 1 -t 0.35 -i images/anime_fighter_ren.jpg \
  -loop 1 -t 0.50 -i images/anime_fighter_ren_impact.jpg \
  -loop 1 -t 0.15 -i images/anime_fighter_ren.jpg \
  -filter_complex "[0:v]scale=720:960,zoompan=z='min(zoom+0.04,1.3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=11:s=720x960:fps=30[v0]; \
  [1:v]scale=720:960,zoompan=z='1.2+0.05*sin(in*15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=15:s=720x960:fps=30[v1]; \
  [2:v]scale=720:960,fps=30[v2]; \
  [v0][v1][v2]concat=n=3:v=1:a=0,format=yuv420p[out]" \
  -map "[out]" -c:v libx264 -pix_fmt yuv420p -r 30 -t 1.0 public/videos/ren_combat_move.mp4

# Fighter 3: Kira
ffmpeg -y -loop 1 -t 0.35 -i images/anime_fighter_kira.jpg \
  -loop 1 -t 0.50 -i images/anime_fighter_kira_impact.jpg \
  -loop 1 -t 0.15 -i images/anime_fighter_kira.jpg \
  -filter_complex "[0:v]scale=720:960,zoompan=z='min(zoom+0.04,1.3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=11:s=720x960:fps=30[v0]; \
  [1:v]scale=720:960,zoompan=z='1.2+0.05*sin(in*15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=15:s=720x960:fps=30[v1]; \
  [2:v]scale=720:960,fps=30[v2]; \
  [v0][v1][v2]concat=n=3:v=1:a=0,format=yuv420p[out]" \
  -map "[out]" -c:v libx264 -pix_fmt yuv420p -r 30 -t 1.0 public/videos/kira_combat_move.mp4

# Also copy to images/videos
cp public/videos/*.mp4 images/videos/
echo "Videos created successfully!"
