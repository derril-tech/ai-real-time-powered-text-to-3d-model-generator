from fastapi import APIRouter

from app.api.v1.endpoints import auth, prompts, runs, geometry, textures, exports, websocket

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(prompts.router, prefix="/prompts", tags=["prompts"])
api_router.include_router(runs.router, prefix="/runs", tags=["generation runs"])
api_router.include_router(geometry.router, prefix="/geometry", tags=["geometry operations"])
api_router.include_router(textures.router, prefix="/textures", tags=["texture operations"])
api_router.include_router(exports.router, prefix="/exports", tags=["exports"])
api_router.include_router(websocket.router, prefix="/ws", tags=["websocket"])
