swig -javascript -node -c++ rvo2.i && sed -i 's/std::vector< Line >/std::vector< RVO::Line >/g' rvo2_wrap.cxx && node-gyp rebuild
